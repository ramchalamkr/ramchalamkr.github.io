# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A personal cybersecurity portfolio site for Gayathri Rajamohan, hosted at [defendwithgr.github.io](https://defendwithgr.github.io). Built with Jekyll using the `jekyll-theme-console` remote theme, customized with a terminal/cyberpunk aesthetic.

## Local Development

**Install dependencies:**
```bash
bundle install
```

**Serve locally with live reload:**
```bash
bundle exec jekyll serve
```
Site runs at `http://localhost:4000`. The `_site/` folder is the generated output — never edit it directly.

**Build for production:**
```bash
bundle exec jekyll build
```

**Pre-commit hooks:** `.pre-commit-config.yaml` runs trailing-whitespace, end-of-file-fixer, check-yaml, and check-added-large-files. Run `pre-commit install` once to enable them locally.

**Local builds vs. GitHub Pages:** `_config.yml` uses `remote_theme: b2a3e8/jekyll-theme-console`. For local builds when network/SSL is unavailable, comment out `remote_theme` and use `theme: jekyll-theme-console` (requires the gem to be installed locally).

## Architecture

**Theme & Layout:** The site inherits from `jekyll-theme-console` via GitHub Pages remote theme. Layout overrides live in `_includes/` (currently `head.html` injects the custom CSS, and `header.html` overrides the nav). All visual customization is in `assets/css/custom.css`.

**Color palette (CSS variables in custom.css):**
- Cyan accent: `#00d9ff`
- Green accent: `#06ffa5`
- Pink accent: `#ff006e`
- Dark background (dark mode): `#0a0e27`

**Pages:** Each `.md` file in the root is a nav page. Front matter uses `layout: page` (or `layout: default` for index). The `header_pages` key in `_config.yml` controls which pages appear in the nav bar.

**Blog posts:** Stored as `.md` files in the root (e.g., `ai-vs-zero-trust-2025.md`, `why-smart-people-fall-for-phishing.md`). Linked manually from `blog.md` — there is no `_posts/` directory or date-based collection currently.

**Projects:** Defined as a Jekyll collection in `_config.yml` with `output: true` and permalink `/projects/:name/`. Project files go in `_projects/`, each with front matter `layout: page`, `title`, and `permalink: /projects/<name>/`, and the same terminal-prompt header pattern as other pages.

**Custom terminal prompt styling:** Pages use inline HTML spans with classes `.term-prompt`, `.term-path`, `.term-filename`, `.term-cursor` to render the terminal-style page headers (e.g., `> gayathri@defendwithgr ~ cat whoami.md █`).

**Dark mode:** Implemented entirely in `custom.css` via `@media (prefers-color-scheme: dark)`. The theme also has `listen_for_clients_preferred_style: true` in `_config.yml`.

## Deployment

GitHub Pages is configured (Settings → Pages) to build directly from the **`terminal-redesign`** branch using the legacy "Deploy from a branch" method — **not** GitHub Actions, and **not** `main`. Pushes to `terminal-redesign` go live automatically; pushes to `main` have no effect on the live site.

`main` and `gh-pages` currently hold stale, unrelated content from an earlier al-folio-theme attempt and are not part of the live deployment. Don't assume `main` reflects production — check `gh api repos/defendwithgr/defendwithgr.github.io/pages` (or the Pages settings page) if this ever changes.
