import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Generated placeholder art in /public/images/placeholders is SVG.
    // Safe to allow since these are our own local, static files only.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
