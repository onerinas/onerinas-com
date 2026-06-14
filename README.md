# onerinas — personal site + blog

Static site built with [Eleventy (11ty)](https://www.11ty.dev/). Hosted free on [Cloudflare Pages](https://pages.cloudflare.com/).

**Domain (planned):** `blog.onerinas.com` — all URLs are root-relative (`/about/`, `/articles/…`) so moving to `onerinas.com` later is DNS + redirects only.

## Structure

```
.
├── .eleventy.js              # Eleventy config
├── data/
│   └── articles.yml          # Article manifest (id, slug, title, published_at)
├── scripts/
│   ├── generate-redirects.js # Builds src/_redirects from manifest
│   └── import-from-blog.js   # Scrape blog.onerinas.com (one-time migration)
├── src/
│   ├── _data/site.json       # Site name, URL, description
│   ├── _includes/layouts/    # base + article layouts
│   ├── _redirects            # Generated — legacy /articles/{id} → canonical URL
│   ├── articles/             # Blog posts (markdown)
│   ├── css/style.css
│   ├── about.md              # Static page
│   ├── projects.md           # Static page (stub)
│   ├── index.njk             # Home
│   ├── articles.njk          # Blog index at /articles/
│   └── feed.xml.njk          # RSS/Atom — articles only
└── _site/                    # Build output (gitignored)
```

## URL conventions

| Type | Pattern | Example |
|------|---------|---------|
| Page | `/page-name/` | `/about/` |
| Article (canonical) | `/articles/{id}-{slug}/` | `/articles/1-hello-world/` |
| Legacy redirect | `/articles/{id}` → 301 | `/articles/1` |

## Local development

Requires Node.js 20+ (see `.nvmrc`).

```bash
npm install
npm run dev
```

Open http://localhost:8080 (Eleventy’s default port).

Production build:

```bash
npm run build
# Output in _site/
```

## Cloudflare Pages deploy

1. Push this repo to GitHub/GitLab.
2. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → connect repo.
3. Build settings:

   | Setting | Value |
   |---------|-------|
   | Framework preset | Eleventy (or None) |
   | Build command | `npm run build` |
   | Build output directory | `_site` |
   | Node version | `22` (Environment variable `NODE_VERSION` or use `.nvmrc`) |

4. Add custom domain `blog.onerinas.com` under **Custom domains**.

Every push to the production branch rebuilds and deploys. Preview URLs on PRs are included.

## Adding a static page

Create a markdown file in `src/`:

```markdown
---
layout: layouts/base.njk
title: Uses
permalink: /uses/
---
# Uses

Page content here.
```

No manifest or redirect entry needed.

## Adding an article

1. **Add to manifest** — `data/articles.yml`:

   ```yaml
   - id: 2
     slug: my-new-post
     title: My New Post
     published_at: 2025-06-15
   ```

2. **Create the post** — `src/articles/2-my-new-post.md`:

   ```markdown
   ---
   id: 2
   slug: my-new-post
   title: My New Post
   date: 2025-06-15
   layout: layouts/article.njk
   permalink: /articles/2-my-new-post/
   tags:
     - articles
   ---
   Post body in markdown.
   ```

3. **Regenerate redirects** (also runs on build):

   ```bash
   npm run redirects
   ```

   This appends `/articles/2 /articles/2-my-new-post/ 301` to `src/_redirects`.

4. Commit manifest, post, and updated `src/_redirects`.

## Legacy redirects

`data/articles.yml` is the source of truth. `scripts/generate-redirects.js` writes `src/_redirects`, which Eleventy copies to `_site/_redirects` for Cloudflare Pages.

Do not hand-edit `src/_redirects` — run `npm run redirects` after changing the manifest.

## Bulk migration (later)

When you export from Feedbackface / OneSimpleBlog (`id`, `slug`, `title`, `body`, `published_at`):

1. Append rows to `data/articles.yml`.
2. Add markdown files under `src/articles/` (or extend the script to scaffold them).
3. Run `npm run redirects && npm run build`.

**Already migrated:** all 69 posts from `blog.onerinas.com` were imported with:

```bash
npm run import:blog   # scrapes live site → src/articles/ + data/articles.yml
npm run redirects
npm run build
```

Re-run `import:blog` only if you need to refresh from the live site (overwrites articles).

### Article images

Images live in `src/images/articles/` (copied from your R2 export). Mapping is curated in `data/article-images.yml` — run after adding images:

```bash
npm run images
```

This picks the highest-quality file when R2 has duplicates (full-size originals vs 1024px resizes). See `data/image-mapping.json` for the audit trail.

## RSS

Articles-only feed at `/feed.xml`. Linked in the site nav footer and `<head>`.
