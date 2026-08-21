# Deploying to a Hetzner VPS (Docker)

## 1. One-time host setup

```bash
mkdir -p /opt/gedosalon/data /opt/gedosalon/uploads /opt/gedosalon/backups
```

These directories are bind-mounted into the container (see `docker-compose.yml`) and are the only place production data actually lives — the container itself is disposable.

## 2. Environment variables

Copy `.env.example` to `.env.production` on the server and fill in real values:

```
DATABASE_URL=file:/data/app.db
SESSION_SECRET=<openssl rand -base64 32>
ADMIN_EMAIL=admin@gedosalons.com
ADMIN_PASSWORD=<a strong password — required in production, no default>
NEXT_PUBLIC_SITE_URL=https://www.gedosalons.com
NODE_ENV=production
```

`.env.production` must never be committed — it's covered by `.gitignore`'s `.env*` rule already.

## 3. Build the image

```bash
docker compose build
```

## 4. Run database migrations

Migrations run via the `builder` stage (which still has the Prisma CLI — the final `runner` image deliberately doesn't, to stay minimal). This is a one-off command, not part of normal container startup:

```bash
docker build --target builder -t gedosalon:migrate .
docker run --rm \
  --env-file .env.production \
  -v /opt/gedosalon/data:/data \
  gedosalon:migrate npx prisma migrate deploy
```

First deploy only — seed the admin account (also via the `migrate` image, same volume):

```bash
docker run --rm \
  --env-file .env.production \
  -v /opt/gedosalon/data:/data \
  gedosalon:migrate npx prisma db seed
```

`ADMIN_PASSWORD` **must** be set in `.env.production` for this to succeed — `prisma/seed.ts` throws instead of falling back to a default when `NODE_ENV=production`.

## 5. Start the app

```bash
docker compose up -d
```

The app now listens on port 3000 (put a reverse proxy — nginx/Caddy — in front of it for TLS; see the Reverse Proxy note below).

## 6. Redeploying after a code change

```bash
docker compose build
docker build --target builder -t gedosalon:migrate .
docker run --rm --env-file .env.production -v /opt/gedosalon/data:/data gedosalon:migrate npx prisma migrate deploy
docker compose up -d
```

The bind-mounted `/data` and `/app/public/uploads` survive this — nothing above deletes or resets them.

## Persistent data

| What | Host path | Container path |
|---|---|---|
| SQLite database | `/opt/gedosalon/data/app.db` | `/data/app.db` |
| Uploaded images | `/opt/gedosalon/uploads/` | `/app/public/uploads/` |

Both are host bind-mounts (see `docker-compose.yml`), not stored in the container's writable layer — `docker compose down && docker compose up -d`, or a full image rebuild, does not touch them.

## Backups

```bash
# Create a backup (writes to /opt/gedosalon/backups/<timestamp>/ by default)
./scripts/backup.sh

# Verify a backup exists and is a valid SQLite file
ls -lh /opt/gedosalon/backups/<timestamp>/
sqlite3 /opt/gedosalon/backups/<timestamp>/app.db "PRAGMA integrity_check;"

# Restore a backup (stops-the-app reminder is printed; do it first)
docker compose stop app
./scripts/restore.sh /opt/gedosalon/backups/<timestamp>
docker compose up -d app
```

Run `backup.sh` on a cron schedule, e.g. daily at 3am:

```
0 3 * * * DATA_DIR=/opt/gedosalon/data UPLOADS_DIR=/opt/gedosalon/uploads /opt/gedosalon/repo/scripts/backup.sh >> /var/log/gedosalon-backup.log 2>&1
```

Periodically copy `/opt/gedosalon/backups/` off the VPS (e.g. to Hetzner Storage Box, S3, or just `rsync` to another machine) — a backup that only lives on the same disk as the original doesn't protect against disk failure.

## Reverse proxy (recommended, not included)

Put nginx or Caddy in front of the container for TLS termination and to raise the upload body-size limit above its default (which is often smaller than this app's 5MB upload cap). Example nginx snippet:

```nginx
client_max_body_size 8m;
location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

The app's rate limiter and `getClientIp()` read `x-forwarded-for`, so the proxy setting it correctly (as above) is required for per-IP login throttling to work as intended — without a proxy in front, or with one that doesn't set this header, all requests are treated as a single IP bucket.
