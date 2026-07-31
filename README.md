# jessicasmith.dev

Personal blog, built with [Astro](https://astro.build). Deployed to GitHub Pages via GitHub Actions.

## Commands

| Command           | Action                                       |
| :----------------- | :------------------------------------------- |
| `npm install`       | Install dependencies                          |
| `npm run dev`       | Start local dev server at `localhost:4321`    |
| `npm run build`     | Build production site to `./dist/`            |
| `npm run preview`   | Preview the build locally before deploying    |

## Writing a post

Add a Markdown file to `src/content/blog/` with frontmatter:

```yaml
---
title: 'Post title'
description: 'One-line summary for SEO/RSS.'
pubDate: 2026-01-01
---
```

Push to `main` — the GitHub Actions workflow builds and deploys automatically.
