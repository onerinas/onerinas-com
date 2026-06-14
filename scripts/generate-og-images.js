#!/usr/bin/env node
/**
 * Generate Open Graph PNGs at build time from page title + description.
 *
 * Run: npm run og
 * Called automatically after `npm run build`.
 */

const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const satori = require("satori").default;
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..");
const SITE = path.join(ROOT, "src", "_data", "site.json");
const OUT_DIR = path.join(ROOT, "_site", "og");
const ARTICLES_DIR = path.join(ROOT, "src", "articles");
const FONT_DIR = path.join(ROOT, "node_modules", "@fontsource", "inter", "files");

const STATIC_PAGES = [
  { file: "src/index.njk", url: "/" },
  { file: "src/about.md", url: "/about/" },
  { file: "src/work.njk", url: "/work/" },
  { file: "src/projects.njk", url: "/projects/" },
  { file: "src/articles.njk", url: "/articles/" },
  { file: "src/links.njk", url: "/links/" },
];

let fontsPromise;

function truncate(text, max) {
  const normalized = String(text).replace(/\s+/g, " ").trim();
  if (normalized.length <= max) {
    return normalized;
  }

  return `${normalized.slice(0, max - 1).trimEnd()}…`;
}

function readFrontMatter(filePath) {
  const raw = fs.readFileSync(path.join(ROOT, filePath), "utf8");
  const match = raw.match(/^---\n([\s\S]*?)\n---/);

  if (!match) {
    return {};
  }

  return yaml.load(match[1]) || {};
}

function ogPublicPath(url) {
  if (url === "/") {
    return "/og/home.png";
  }

  return `/og/${url.replace(/^\/|\/$/g, "")}.png`;
}

function ogOutputPath(url) {
  const rel = url === "/" ? "home.png" : `${url.replace(/^\/|\/$/g, "")}.png`;
  return path.join(OUT_DIR, rel);
}

function pageDescription(data, site) {
  if (data.description) {
    return data.description;
  }

  if (data.tags && data.tags.includes("articles")) {
    return `${data.title} — writing by ${site.name}.`;
  }

  return site.description;
}

function pageTitle(data, site) {
  if (data.title) {
    return data.title;
  }

  if (data.url === "/") {
    return site.name;
  }

  return site.name;
}

async function loadFonts() {
  if (fontsPromise) {
    return fontsPromise;
  }

  fontsPromise = Promise.all([
    fs.promises.readFile(path.join(FONT_DIR, "inter-latin-400-normal.woff")),
    fs.promises.readFile(path.join(FONT_DIR, "inter-latin-700-normal.woff")),
  ]).then(([regular, bold]) => [
    {
      name: "Inter",
      data: regular,
      weight: 400,
      style: "normal",
    },
    {
      name: "Inter",
      data: bold,
      weight: 700,
      style: "normal",
    },
  ]);

  return fontsPromise;
}

function ogMarkup({ title, description, siteName }) {
  return {
    type: "div",
    props: {
      style: {
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "linear-gradient(135deg, #ffffff 0%, #fff5f0 100%)",
        padding: "72px",
        fontFamily: "Inter",
      },
      children: [
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#ff6b35",
            },
            children: siteName,
          },
        },
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              flex: 1,
              justifyContent: "center",
            },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    fontSize: 58,
                    fontWeight: 700,
                    lineHeight: 1.15,
                    letterSpacing: "-0.03em",
                    color: "#1a1a1a",
                  },
                  children: truncate(title, 90),
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    fontSize: 30,
                    lineHeight: 1.45,
                    color: "#666666",
                  },
                  children: truncate(description, 140),
                },
              },
            ],
          },
        },
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              fontSize: 24,
              color: "#999999",
            },
            children: "blog.onerinas.com",
          },
        },
      ],
    },
  };
}

async function renderOgImage(page, site) {
  const fonts = await loadFonts();
  const svg = await satori(
    ogMarkup({
      title: pageTitle(page, site),
      description: pageDescription(page, site),
      siteName: site.name,
    }),
    {
      width: 1200,
      height: 630,
      fonts,
    }
  );

  const outputPath = ogOutputPath(page.url);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  await sharp(Buffer.from(svg)).png().toFile(outputPath);

  return outputPath;
}

function collectPages(site) {
  const pages = STATIC_PAGES.map(({ file, url }) => ({
    url,
    ...readFrontMatter(file),
  }));

  const articleFiles = fs
    .readdirSync(ARTICLES_DIR)
    .filter((name) => name.endsWith(".md"))
    .sort();

  for (const filename of articleFiles) {
    const data = readFrontMatter(path.join("src", "articles", filename));
    pages.push({
      ...data,
      url: data.permalink || `/articles/${filename.replace(/\.md$/, "")}/`,
    });
  }

  return pages;
}

async function main() {
  if (!fs.existsSync(path.join(ROOT, "_site"))) {
    throw new Error("Run eleventy build first (_site/ missing).");
  }

  const site = JSON.parse(fs.readFileSync(SITE, "utf8"));
  const pages = collectPages(site);

  fs.mkdirSync(OUT_DIR, { recursive: true });

  let generated = 0;

  for (const page of pages) {
    await renderOgImage(page, site);
    generated += 1;
  }

  const manifest = pages.map((page) => ({
    url: page.url,
    image: ogPublicPath(page.url),
  }));

  fs.writeFileSync(
    path.join(OUT_DIR, "manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8"
  );

  console.log(`Generated ${generated} Open Graph image(s) in _site/og/`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
