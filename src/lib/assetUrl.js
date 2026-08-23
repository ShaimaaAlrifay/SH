/* ============================================================
   Resolves a public/-folder asset path against Vite's configured
   base (vite.config.js: base:"/SH/", since this site deploys under
   a GitHub Pages project subpath, not the domain root). A plain
   "/assets/..." string always resolves to the *domain* root, which
   is correct in dev (served at /) but 404s in production (served
   at /SH/) — that mismatch is what broke every image/video/font
   reference after the GitHub Pages deploy. import.meta.env.BASE_URL
   already carries the right prefix in both environments, so every
   public-asset reference in this codebase should go through this
   helper instead of a hardcoded leading-slash string.
   ============================================================ */
export function assetUrl(path) {
  return `${import.meta.env.BASE_URL}${String(path).replace(/^\//, "")}`;
}
