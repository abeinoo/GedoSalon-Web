# Multi-stage production build for the Gedo Salon admin/site.
#
# Uses node:22-slim (Debian, glibc) rather than an alpine base. better-sqlite3
# is a native addon; alpine's musl libc is a recurring source of "works on
# my machine, fails in the container" native-module breakage, and slim keeps
# a working C toolchain available for `npm install` without extra apk juggling.
#
# Build with:
#   docker build -t gedosalon:latest .
# Run migrations (see DEPLOY.md) against the same image with:
#   docker build --target builder -t gedosalon:migrate .

FROM node:22-slim AS base
# better-sqlite3@13 declares `"engines": {"node": ">=22"}` — confirmed by an
# actual `docker build` failing under node:20-slim before this was fixed.
# It also needs to compile its native binding against this exact base
# image's glibc/Node ABI — never copy a binary built on macOS/alpine in.
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ openssl \
  && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# --- deps: install once, cached across builds unless lockfile changes ------
FROM base AS deps
COPY package.json package-lock.json prisma.config.ts ./
COPY prisma ./prisma
# package.json's postinstall runs `prisma generate`, which needs
# prisma/schema.prisma — copied above so this succeeds. Do NOT add
# --ignore-scripts here: @prisma/adapter-better-sqlite3 pulls in its own
# nested better-sqlite3@12 (a different version than our top-level
# better-sqlite3@13, which ships prebuilt binaries and needs no compile
# step) that has no prebuilds and must compile its native binding via this
# install step — confirmed live: an --ignore-scripts build produced an
# image that failed at runtime with "Could not locate the bindings file"
# for that nested copy specifically.
RUN npm ci

# --- builder: full node_modules (incl. devDependencies + Prisma CLI) -------
# Also usable directly as a migration runner via `--target builder`, since
# the final `runner` stage below deliberately does NOT carry the Prisma CLI.
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npx prisma generate

# `next build` statically prerenders "/" (see next.config.ts /
# app/page.tsx), which queries the database for content, and separately
# evaluates every route module (including lib/auth/session.ts, which
# throws at module load if SESSION_SECRET is unset) to collect page
# config — both confirmed live by an actual failed `docker build` before
# this was added. Neither of these build-time values is the real
# production secret/database: SESSION_SECRET is read fresh from the
# environment when the container actually starts (see server.js), and this
# throwaway build.db (migrated so the prerender gets valid empty tables,
# not a "no such table" error) never leaves this stage — the runner stage
# below only copies public/, .next/standalone, .next/static, and prisma/.
ENV SESSION_SECRET="build-time-placeholder-overridden-at-container-startup"
ENV DATABASE_URL="file:./build.db"
RUN npx prisma migrate deploy
RUN npm run build

# --- runner: minimal production image ---------------------------------------
FROM node:22-slim AS runner
RUN apt-get update && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/* \
  && useradd --system --uid 1001 nextjs
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# `output: "standalone"` (next.config.ts) traces only what's actually needed
# at runtime — including better-sqlite3's compiled .node binding and
# @prisma/client, both in Next's default serverExternalPackages list, so
# they're required()'d natively rather than bundled and get copied whole.
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nextjs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nextjs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma

# Persistent, host-mounted directories — see DEPLOY.md. The container must
# never be the only place this data lives.
RUN mkdir -p /data /app/public/uploads \
  && chown -R nextjs:nextjs /data /app/public/uploads

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
