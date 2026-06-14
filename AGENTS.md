## Learned User Preferences

- Commit directly to `main`; skip feature branches unless explicitly requested.
- Keep diffs minimal and scope tight; ask before large themes or complex build pipelines.
- Static site only: no backend, auth, database, or heavy JS frameworks unless asked.
- Match existing design (writing-first layout, warm palette, ~42rem content width); do not introduce a new design system.
- Use display name "Rinas", not "Rinas Muhammed".
- Homepage is writing-first; keep detailed work history on `/work/`, not the home page.
- `/links/` lists external links only, not pages already on the site.
- Group posts as TIL vs Notes on `/articles/` only; no topic or tag URL pages (avoid future SEO churn).
- Never commit `.env`; keep `FATHOM_SITE_ID` in Cloudflare **Build** variables for production.
- Treat the repo as public: no secrets or temporary credentials in tracked files.

## Learned Workspace Facts

- Personal site (Eleventy/11ty, Nunjucks, Node 22); not Paperstick or other SaaS product work.
- GitHub: `onerinas/onerinas-com`; canonical site URL `https://onerinas.com`.
- Hosted on Cloudflare Pages; legacy `blog.onerinas.com` should 301 to apex via Cloudflare Redirect Rule.
- Build: `aube run build` (or `mise run build`) runs redirects, Eleventy, then Open Graph image generation.
- Tooling: Node 22 + aube via `.mise/config.toml`; lockfile is `aube-lock.yaml`.
- `data/articles.yml` is source of truth; `scripts/generate-redirects.js` writes legacy `/articles/{id}` to `/articles/{id}-{slug}/` rules.
- Contact email: `hello@onerinas.com`; active projects: Paperstick (`paperstick.app`) and HiFive (`tryhifive.com`).
- Blog migrated from Feedbackface / OneSimpleBlog; use root-relative URLs throughout.
- Use `.md` for articles and simple pages; `.njk` when pulling from `site.json` or needing loops/includes.
- Fathom loads only when `NODE_ENV=production` and `FATHOM_SITE_ID` is set.
