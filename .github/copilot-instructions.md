# Copilot instructions

## Project snapshot
- Static Eleventy 3.1 site targeting Node 20+. Source lives in `src/`, output collects in `dist/` through `eleventy.config.js`.
- Core config is modular: collections, events, filters, plugins, and shortcodes live under `src/_config/**` and are wired up in `eleventy.config.js`.
- Content types: pages in `src/pages`, posts under `src/posts/YYYY`, shared partials in `src/_includes`, and reusable layouts in `src/_layouts`.

## Dev & build workflow
- Run `npm start` (alias for `npm run dev:11ty`) for the Eleventy dev server; the `eleventy.before` hook autogenerates favicons, CSS, and JS bundles before each serve/build.
- `npm run build` performs a clean (`rimraf dist src/_includes/{css,scripts}`) and production build with minified HTML/CSS/JS. `ELEVENTY_ENV` toggles production behaviour.
- Helpful scripts: `npm run favicons`, `npm run colors`, `npm run screenshots`, and `npm run clean:og`. Each script expects upstream data (`src/_data/meta.js`, `designTokens/**`, `projects.json`).

## Styling system
- CSS is authored in `src/assets/css/**` using Andy Bell's CUBE methodology plus Tailwind utilities generated from design tokens.
- `build-css.js` pipes PostCSS → Tailwind → Autoprefixer → cssnano, writing inline bundles to `src/_includes/css/*.css` and component bundles to `dist/assets/css/components/`.
- Tokens in `src/_data/designTokens/*.json` drive Tailwind (`tailwind.config.js`) and custom properties. Run `npm run colors` after editing `colorsBase.json` to regenerate palettes.

## JavaScript bundling
- `build-js.js` bundles files via esbuild. Source bundles live in `src/assets/scripts/bundle/` (inlined) and `src/assets/scripts/components/` (copied to `dist/assets/scripts/components/`).
- `src/_includes/head/js-inline.njk` and `js-defer.njk` control where bundled scripts are injected. Prefer `is-land` hydration for progressive enhancement.

## Data & automation
- Global metadata comes from `src/_data/meta.js`; `URL` defaults to `http://localhost:8080`, override via `.env`/deploy ENV.
- Collections (`collections.js`) filter Eleventy content; `tagList` excludes `posts/docs/all` by design.
- Draft handling (`plugins/drafts.js`) hides `draft: true` content unless `BUILD_DRAFTS` is truthy (set automatically in serve/watch).

## Assets & media
- Images are processed through the Eleventy Image transform. Markdown images automatically gain responsive widths; use the `{% image %}` shortcode from `shortcodes/image.js` for templates.
- Open Graph artwork lives in `src/assets/og-images`; regenerate JPEG fallbacks with `npm run clean:og` + `npm run build`.
- Favicons regenerate from the SVG defined by `pathToSvgLogo` in `meta.js` via `events/generate-favicons.js`.

## Contribution tips
- When adding new CSS/JS, place sources in `src/assets/**`; the build steps mirror the directory structure. Avoid editing generated files in `src/_includes/css` or `src/_includes/scripts`.
- Reference existing docs in `src/docs/*.md` for component conventions (navigation, pagination, theme switcher, etc.). They contain canonical patterns worth mirroring.
- Keep Eleventy plugins modular. If you create a new filter/shortcode, add it under `src/_config/filters|shortcodes` and export it through the respective index before registering it in `eleventy.config.js`.
- Validate builds locally before committing; linting is implicit in the bundlers, so rely on `npm start` logs to surface PostCSS/esbuild issues.

Let me know if any workflow feels underspecified or if more examples would unblock you.