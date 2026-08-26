import type { NextConfig } from "next";

const securityHeaders = [
  // Force HTTPS on repeat visits. Only meaningful once actually served over
  // HTTPS (e.g. behind the Hetzner reverse proxy) — harmless over plain HTTP
  // in local dev since browsers ignore it there.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // Blocks the whole site (including /admin/login) from being framed by
  // another origin — closes the clickjacking angle on the login page.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  // Standalone output for a minimal, self-contained production Docker
  // image — see Dockerfile.
  output: "standalone",
  // better-sqlite3 loads its native binary through node-gyp-build's
  // runtime platform detection, which Next's file tracer can't follow
  // statically — without this, `.next/standalone` is missing the actual
  // .node binary and crashes at startup with "Cannot find module".
  // (Confirmed by inspecting the standalone build output directly.) The
  // Dockerfile also copies better-sqlite3 in explicitly as a second,
  // environment-independent safety net.

  serverExternalPackages: [
  "@prisma/client",
  "@prisma/adapter-better-sqlite3",
  "better-sqlite3",
],

  outputFileTracingIncludes: {
    "/*": ["./node_modules/better-sqlite3/**/*", "./node_modules/bindings/**/*", "./node_modules/file-uri-to-path/**/*"],
  },
  // Don't advertise the framework/version in responses.
  poweredByHeader: false,
  images: {
    // Generated placeholder art in /public/images/placeholders is SVG.
    // Safe to allow since these are our own local, static files only.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
