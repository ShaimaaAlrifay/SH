import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
//
// base: was hardcoded to "/SH/" (the GitHub Pages project subpath), which
// baked "/SH/assets/index-*.js" into dist/index.html. On any other host —
// e.g. the private server, where the site is served from the domain root
// or a different folder — that URL doesn't exist, the server answers with
// its index.html fallback, and the browser refuses to run HTML as a module
// script ("Expected a JavaScript module script but the server responded
// with a MIME type of text/html").
//
// "./" makes every built asset URL relative to index.html, so the same
// dist/ works at "/", "/SH/", or any other folder. Set BASE_PATH (e.g.
// BASE_PATH=/portfolio/) only if an absolute base is ever needed.
export default defineConfig({
  plugins: [react()],
  base: process.env.BASE_PATH || './',
})
