# onerinas: personal site + blog

Static site built with [Eleventy (11ty)](https://www.11ty.dev/). Hosted on [Cloudflare Workers](https://developers.cloudflare.com/workers/static-assets/) (static assets).

**Domain:** `onerinas.com`: canonical URLs use `site.json` → `url`. All paths are root-relative (`/about/`, `/articles/…`).

**Legacy subdomain:** `blog.onerinas.com` should 301 to `onerinas.com` via a Cloudflare Redirect Rule (see deploy section).

## Structure

```
.
├── mise.toml                 # Node 22 + aube (mise-en-place)
├── aube-lock.yaml            # Dependency lockfile (aube native)
├── wrangler.jsonc            # Cloudflare Workers static assets config
├── .eleventy.js              # Eleventy config
├── data/
│   ├── articles.yml          # Article manifest (id, slug, title, published_at)
│   └── article-images.yml    # Image mapping for posts
├── scripts/
│   ├── generate-redirects.js # Builds src/_redirects from manifest
│   ├── generate-og-images.js # Builds _site/og/*.png at end of build
│   └── import-from-blog.js   # Scrape blog.onerinas.com (one-time migration)
├── src/
│   ├── _data/site.json       # Site name, URL, description, projects
│   ├── _includes/
│   │   ├── layouts/          # base, page, article
│   │   └── partials/         # seo-head, json-ld, contact, experience
│   ├── _redirects            # Generated: legacy /articles/{id} → canonical URL
│   ├── articles/             # Blog posts (.md)
│   ├── css/style.css
│   ├── about.md              # Static page (markdown)
│   ├── index.njk             # Home (writing-first)
│   ├── work.njk              # Experience
│   ├── projects.njk          # Active projects
│   ├── links.njk             # External links
│   ├── articles.njk          # Blog index at /articles/
│   ├── feed.xml.njk          # RSS/Atom (articles only)
│   ├── sitemap.xml.njk
│   └── robots.txt.njk
└── _site/                    # Build output (gitignored)
```

### Templates (`.njk`)

`.njk` files are [Nunjucks](https://mozilla.github.io/nunjucks/) templates: HTML with variables, loops, and includes. Eleventy uses them for pages that need layout logic (home, work, projects) or generated output (feed, sitemap). Static prose pages can stay plain `.md`; use `.njk` when you want to pull from `site.json` or include partials.

| File type | Use for |
|-----------|---------|
| `.md` | Articles and simple static pages (About) |
| `.njk` | Pages with loops/includes, or XML templates |

## URL conventions

| Type | Pattern | Example |
|------|---------|---------|
| Page | `/page-name/` | `/about/` |
| Article (canonical) | `/articles/{id}-{slug}/` | `/articles/1-hello-world/` |
| Legacy redirect | `/articles/{id}` → 301 | `/articles/1` |

## Local development

Requires [mise](https://mise.jdx.dev/) (2026.4.18+) with Node 22 and aube pinned in `mise.toml`.

```bash
mise trust
mise install
aube install
aube run dev
```

Or use mise tasks: `mise run dev`, `mise run build`, `mise run deploy`.

**Lockfile:** `aube-lock.yaml` (aube native). After changing `package.json`, run `aube install`. CI uses `aube ci` (frozen lockfile). Dependabot does not support this format yet; use `aube update` for dependency bumps.

Open http://localhost:8080 (Eleventy’s default port).

Production build (redirects → Eleventy → Open Graph images):

```bash
aube run build
# Output in _site/ (includes _site/og/*.png for social previews)
```

Copy `.env.example` to `.env` for local Fathom testing. Production uses Cloudflare **Build** variables (see deploy section).

## Cloudflare deploy

Same pattern as [paperstickio/website](https://github.com/paperstickio/website): **`wrangler.jsonc` is the config**, deploy with **`npx wrangler deploy`**. The difference is this site has a build step (Eleventy → `_site/`), so `wrangler.jsonc` defines `build.command`.

1. Push this repo to GitHub.
2. Cloudflare dashboard → **Workers & Pages** → connect repo **`onerinas/onerinas-com`**.
3. Build settings:

   | Setting | Value |
   |---------|--------|
   | Build command | see below |
   | Deploy command | `npx wrangler deploy` |

   Cloudflare does **not** include mise, and it auto-runs `bun install` (or npm) before your build command unless you skip that. For aube + `mise.toml`, use:

   **Build command:**

   ```bash
   curl -fsSL https://mise.run | sh && export PATH="$HOME/.local/bin:$PATH" && eval "$(mise activate bash --shims)" && mise install && aube ci
   ```

   **Build variables** (Settings → Build → Build variables):

   | Variable | Value |
   |----------|--------|
   | `SKIP_DEPENDENCY_INSTALL` | `true` |
   | `NODE_ENV` | `production` |
   | `FATHOM_SITE_ID` | your Fathom site ID |

   `SKIP_DEPENDENCY_INSTALL` stops Cloudflare from running `bun install` / `npm install` before your command (which would ignore `aube-lock.yaml`). mise then installs Node 22 + aube from `mise.toml`, and `aube ci` installs deps from the lockfile. `npx wrangler deploy` runs `build.command` from `wrangler.jsonc`, then uploads `_site/`.

   Do **not** set `NODE_VERSION` unless you want to override mise; `mise.toml` pins Node 22. Build variables are build-time only, not runtime Worker variables.

4. Add custom domain **`onerinas.com`** under **Custom domains**.

5. **Redirect old subdomain** (Cloudflare → **Rules** → **Redirect Rules**):

   - **When:** Hostname equals `blog.onerinas.com`
   - **Then:** Dynamic redirect to `concat("https://onerinas.com", http.request.uri.path)` with status **301**, preserve query string

   Short article URLs (`/articles/1`) redirect to canonical slugs via `_redirects` in `_site/`.

Every push to the production branch rebuilds and deploys. Preview URLs on PRs are included.

Local deploy: `aube ci && mise run deploy` (or `npx wrangler deploy` after deps are installed).

## Adding a static page

**Markdown:** create a file in `src/`:

```markdown
---
layout: layouts/page.njk
title: Uses
permalink: /uses/
description: Short summary for SEO.
---
Page content here.
```

**Nunjucks:** for pages that loop over data or include partials, create `src/uses.njk` instead (see `projects.njk` or `work.njk`).

No manifest or redirect entry needed.

## Adding an article

1. **Add to manifest** (`data/articles.yml`):

   ```yaml
   - id: 2
     slug: my-new-post
     title: My New Post
     published_at: 2025-06-15
   ```

2. **Create the post** (`src/articles/2-my-new-post.md`):

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
   aube run redirects
   ```

   This appends `/articles/2 /articles/2-my-new-post/ 301` to `src/_redirects`.

4. Commit manifest, post, and updated `src/_redirects`.

## Legacy redirects

`data/articles.yml` is the source of truth. `scripts/generate-redirects.js` writes `src/_redirects`, which Eleventy copies to `_site/_redirects` for Cloudflare.

Do not hand-edit `src/_redirects`. Run `aube run redirects` after changing the manifest.

## Bulk migration (later)

When you export from Feedbackface / OneSimpleBlog (`id`, `slug`, `title`, `body`, `published_at`):

1. Append rows to `data/articles.yml`.
2. Add markdown files under `src/articles/` (or extend the script to scaffold them).
3. Run `aube run redirects && aube run build`.

**Already migrated:** all 69 posts from `blog.onerinas.com` were imported with:

```bash
aube run import:blog   # scrapes live site → src/articles/ + data/articles.yml
aube run redirects
aube run build
```

Re-run `import:blog` only if you need to refresh from the live site (overwrites articles).

### Article images

Images live in `src/images/articles/` (copied from your R2 export). Mapping is curated in `data/article-images.yml`:

```bash
node scripts/install-article-images.js
```

This picks the highest-quality file when R2 has duplicates (full-size originals vs 1024px resizes). See `data/image-mapping.json` for the audit trail.

## RSS

Articles-only feed at `/feed.xml`. Linked in `<head>` via `feed.xml.njk`.
