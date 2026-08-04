# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal blog (jessicasmith.dev) built with **Astro v7** using the **AstroPaper v6** theme, deployed to GitHub Pages. Single project, not a monorepo. Node `>=22.12.0`.

## Commands

```
npm run dev            # astro dev — localhost:4321
npm run build           # astro check && astro build && pagefind --site dist && cp -r dist/pagefind public/
npm run preview         # astro preview
npm run format:check    # prettier --check .
npm run format           # prettier --write .
npm run lint             # eslint .
```

No test suite exists — `astro check` (run as part of `build`) is the only correctness gate.

`build` is a 4-step chain: type-check, build, generate the Pagefind search index from `dist/`, then copy that index into `public/` so local `preview` and the next dev cycle have a working search index. Don't shortcut this by running `astro build` alone when search behavior matters.

## Code Style

- Prettier is the source of truth (`.prettierrc`): double quotes, semicolons, 80-col, 2-space indent, avoid arrow parens, ES5 trailing commas. `.astro` files use the `astro` parser via `prettier-plugin-astro`.
- ESLint (`eslint.config.js`) sets `no-console: "error"` — don't leave `console.*` calls in.
- `tsconfig.json` extends `astro/tsconfigs/strict`. Path aliases: `@/*` → `./src/*`, `@/astro-paper.config` → `./astro-paper.config`.

## Content

- Posts live in `src/content/posts/` (`.md`/`.mdx`), schema in `src/content.config.ts`. Required frontmatter: `title`, `pubDatetime`, `description`. Optional: `tags` (defaults to `["others"]`), `author`, `draft`, `featured`, `modDatetime`, `ogImage`, `canonicalURL`, `hideEditPost`, `timezone`.
- Static pages (e.g. about) live in `src/content/pages/`, schema also in `src/content.config.ts`.
- `drafts/` at the repo root holds in-progress writing (not part of the Astro build) — draft notes and fragments before a piece is ready to move into `src/content/posts/`.

## Config

- `astro.config.ts` — Astro integrations, markdown/shiki, fonts, i18n.
- `astro-paper.config.ts` — theme-level config (site URL, author, feature toggles).
- `src/config.ts` — general site config consumed by the content schema.

## Deploy

Push to `main` triggers `.github/workflows/deploy.yml`, which builds (Node 22 via `withastro/action@v3`) and deploys to GitHub Pages. Custom domain via `public/CNAME` (`jessicasmith.dev`).
