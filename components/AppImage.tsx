import Image, { type ImageProps } from "next/image";

// Thin wrapper around next/image for any src that may point at an admin
// upload (`/uploads/...`). The Next.js image optimizer resolves local
// sources by having the Next.js server itself re-fetch them over HTTP — in
// production that request goes to 127.0.0.1 *inside* the app container, but
// `/uploads/*` is only served publicly by nginx (see DEPLOY.md), so the
// in-container fetch 404s. Skipping optimization for these paths serves the
// original file directly instead of routing it through that lookup.
export default function AppImage(props: ImageProps) {
  const isUpload = typeof props.src === "string" && props.src.startsWith("/uploads/");
  // eslint-disable-next-line jsx-a11y/alt-text -- `alt` is required by ImageProps and forwarded via the spread; the rule can't see through it.
  return <Image {...props} unoptimized={props.unoptimized ?? isUpload} />;
}
