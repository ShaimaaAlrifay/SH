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

   base is now "./" (relative — see vite.config.js) so the same build
   works on GitHub Pages and the private server alike. The result is
   resolved to an absolute URL against the page's own location, because
   --sketch / --notes are url()s consumed from the built stylesheet in
   assets/, where a relative "./assets/..." could resolve against the
   stylesheet's folder instead of the page.
   ============================================================ */
export function assetUrl(path) {
  const base = new URL(import.meta.env.BASE_URL, document.baseURI);
  return new URL(String(path).replace(/^\//, ""), base).href;
}
