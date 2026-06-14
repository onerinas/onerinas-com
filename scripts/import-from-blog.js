#!/usr/bin/env node
/**
 * Import articles from blog.onerinas.com into src/articles/ and data/articles.yml.
 *
 * Usage: node scripts/import-from-blog.js
 * Optional: BLOG_ORIGIN=https://blog.onerinas.com node scripts/import-from-blog.js
 */

const fs = require("fs");
const path = require("path");
const TurndownService = require("turndown");
const { gfm } = require("turndown-plugin-gfm");
const yaml = require("js-yaml");

const ORIGIN = process.env.BLOG_ORIGIN || "https://blog.onerinas.com";
const ROOT = path.join(__dirname, "..");
const ARTICLES_DIR = path.join(ROOT, "src", "articles");
const MANIFEST = path.join(ROOT, "data", "articles.yml");

const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
});
turndown.use(gfm);
turndown.addRule("preToFence", {
  filter: (node) => node.nodeName === "PRE",
  replacement: (content) => {
    const trimmed = content.replace(/^\n+|\n+$/g, "");
    return `\n\n\`\`\`\n${trimmed}\n\`\`\`\n\n`;
  },
});
turndown.addRule("preserveLineBreaks", {
  filter: ["br"],
  replacement: () => "  \n",
});

const MONTHS = {
  January: "01",
  February: "02",
  March: "03",
  April: "04",
  May: "05",
  June: "06",
  July: "07",
  August: "08",
  September: "09",
  October: "10",
  November: "11",
  December: "12",
};

function parsePublishedDate(text) {
  const match = text.match(/Published on (\w+) (\d{1,2}), (\d{4})/);
  if (!match) {
    throw new Error(`Could not parse date: ${text}`);
  }
  const [, monthName, day, year] = match;
  const month = MONTHS[monthName];
  if (!month) {
    throw new Error(`Unknown month: ${monthName}`);
  }
  return `${year}-${month}-${day.padStart(2, "0")}`;
}

function decodeHtml(text) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function extractArticlesFromIndex(html) {
  const pattern = /href="\/articles\/(\d+)-([^"]+)"/g;
  const byId = new Map();
  let match;

  while ((match = pattern.exec(html)) !== null) {
    const id = Number(match[1]);
    const slug = match[2];
    if (!byId.has(id)) {
      byId.set(id, slug);
    }
  }

  return [...byId.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([id, slug]) => ({ id, slug }));
}

function extractArticle(html) {
  const titleMatch = html.match(/<h1 class="text-3xl font-bold mb-3">([\s\S]*?)<\/h1>/);
  if (!titleMatch) {
    throw new Error("Missing title");
  }

  const dateMatch = html.match(
    /<div class="text-gray-600">\s*Published on ([^<]+)\s*<\/div>/
  );
  if (!dateMatch) {
    throw new Error("Missing published date");
  }

  const bodyMatch = html.match(
    /<div class="trix-content">\s*([\s\S]*?)\s*<\/div>\s*\n\s*<\/div>\s*\n\s*<footer/m
  );
  if (!bodyMatch) {
    throw new Error("Missing article body");
  }

  const title = decodeHtml(titleMatch[1].trim());
  const publishedAt = parsePublishedDate(`Published on ${dateMatch[1].trim()}`);
    const bodyHtml = bodyMatch[1].trim();
    const body = unescapeMarkdown(turndown.turndown(bodyHtml).trim());

  return { title, publishedAt, body };
}

function unescapeMarkdown(text) {
  return text
    .replace(/\\_/g, "_")
    .replace(/\\\[/g, "[")
    .replace(/\\\]/g, "]")
    .replace(/\\`/g, "`")
    .replace(/\\'/g, "'")
    .replace(/\\\*/g, "*")
    .replace(/\\#/g, "#")
    .replace(/^\\-/gm, "-")
    .replace(/\\==/g, "==")
    .replace(/^\\-+/gm, (match) => match.slice(1));
}

function yamlString(value) {
  if (/[:#'"\n]/.test(value) || value.startsWith(" ") || value.endsWith(" ")) {
    return JSON.stringify(value);
  }
  return value;
}

function buildFrontMatter({ id, slug, title, publishedAt }) {
  return [
    "---",
    `id: ${id}`,
    `slug: ${slug}`,
    `title: ${yamlString(title)}`,
    `date: ${publishedAt}`,
    "layout: layouts/article.njk",
    `permalink: /articles/${id}-${slug}/`,
    "tags:",
    "  - articles",
    "---",
    "",
  ].join("\n");
}

async function fetchText(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }
  return response.text();
}

async function main() {
  console.log(`Fetching index from ${ORIGIN}/articles/`);
  const indexHtml = await fetchText(`${ORIGIN}/articles/`);
  const articles = extractArticlesFromIndex(indexHtml);
  console.log(`Found ${articles.length} articles`);

  fs.mkdirSync(ARTICLES_DIR, { recursive: true });

  const manifest = [];
  let imported = 0;

  for (const { id, slug } of articles) {
    const url = `${ORIGIN}/articles/${id}-${slug}`;
    process.stdout.write(`Importing #${id} ${slug}... `);

    const html = await fetchText(url);
    const { title, publishedAt, body } = extractArticle(html);
    const filename = `${id}-${slug}.md`;
    const content = buildFrontMatter({ id, slug, title, publishedAt }) + body + "\n";

    fs.writeFileSync(path.join(ARTICLES_DIR, filename), content, "utf8");
    manifest.push({ id, slug, title, published_at: publishedAt });
    imported += 1;
    console.log("ok");

    await new Promise((resolve) => setTimeout(resolve, 150));
  }

  fs.writeFileSync(MANIFEST, yaml.dump(manifest, { lineWidth: 120 }), "utf8");
  console.log(`\nImported ${imported} articles to src/articles/`);
  console.log(`Updated ${MANIFEST}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
