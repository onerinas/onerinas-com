#!/usr/bin/env node
/**
 * Install article images from local R2 export into src/images/articles/
 * and rewrite markdown to use /images/articles/… paths.
 *
 * Mapping: data/article-images.yml (curated — remote URLs are 404)
 * Source:  ~/projects/onerinas-blog-images (override with IMAGE_SOURCE)
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { execSync } = require("child_process");
const yaml = require("js-yaml");

const ROOT = path.join(__dirname, "..");
const SOURCE_DIR = process.env.IMAGE_SOURCE || path.join(process.env.HOME, "projects", "onerinas-blog-images");
const MAPPING_FILE = path.join(ROOT, "data", "article-images.yml");
const ARTICLES_DIR = path.join(ROOT, "src", "articles");
const OUTPUT_DIR = path.join(ROOT, "src", "images", "articles");
const REPORT = path.join(ROOT, "data", "image-mapping.json");

function md5File(filePath) {
  return crypto.createHash("md5").update(fs.readFileSync(filePath)).digest("hex");
}

function dimensions(filePath) {
  const out = execSync(`sips -g pixelWidth -g pixelHeight ${JSON.stringify(filePath)} 2>/dev/null`, {
    encoding: "utf8",
  });
  const w = out.match(/pixelWidth:\s*(\d+)/);
  const h = out.match(/pixelHeight:\s*(\d+)/);
  return { width: Number(w[1]), height: Number(h[1]) };
}

function extractRemoteUrls(content) {
  const pattern = /!\[[^\]]*\]\((https:\/\/blog\.onerinas\.com[^)]+)\)/g;
  const urls = [];
  let match;
  while ((match = pattern.exec(content)) !== null) {
    urls.push(match[1]);
  }
  return urls;
}

function groupDuplicates(sourceDir) {
  const files = fs.readdirSync(sourceDir).filter((f) => /\.(png|jpe?g|gif|webp)$/i.test(f));
  const byMd5 = new Map();
  for (const name of files) {
    const full = path.join(sourceDir, name);
    const md5 = md5File(full);
    if (!byMd5.has(md5)) byMd5.set(md5, []);
    byMd5.get(md5).push(name);
  }
  return [...byMd5.values()].filter((g) => g.length > 1);
}

function main() {
  if (!fs.existsSync(SOURCE_DIR)) {
    throw new Error(`Image source not found: ${SOURCE_DIR}`);
  }

  const mapping = yaml.load(fs.readFileSync(MAPPING_FILE, "utf8"));
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const installed = [];
  const usedSources = new Set();

  for (const entry of mapping) {
    const articlePath = path.join(ARTICLES_DIR, entry.article);
    if (!fs.existsSync(articlePath)) {
      throw new Error(`Article not found: ${entry.article}`);
    }

    let content = fs.readFileSync(articlePath, "utf8");
    const remoteUrls = extractRemoteUrls(content);

    if (remoteUrls.length !== entry.images.length) {
      throw new Error(
        `${entry.article}: expected ${entry.images.length} images, found ${remoteUrls.length} remote URL(s)`
      );
    }

    entry.images.forEach((img, index) => {
      const sourcePath = path.join(SOURCE_DIR, img.source);
      if (!fs.existsSync(sourcePath)) {
        throw new Error(`Missing source image: ${img.source}`);
      }

      const ext = path.extname(img.source).toLowerCase();
      const base = path.basename(entry.article, ".md");
      const outputName = `${base}-${index + 1}${ext}`;
      const outputPath = path.join(OUTPUT_DIR, outputName);
      const publicPath = `/images/articles/${outputName}`;

      fs.copyFileSync(sourcePath, outputPath);
      usedSources.add(img.source);

      const dim = dimensions(sourcePath);
      installed.push({
        article: entry.article,
        index,
        source: img.source,
        output: outputName,
        publicPath,
        md5: md5File(sourcePath),
        dimensions: `${dim.width}x${dim.height}`,
        bytes: fs.statSync(sourcePath).size,
        note: img.note || null,
      });

      content = content.replace(remoteUrls[index], publicPath);
    });

    fs.writeFileSync(articlePath, content, "utf8");
    console.log(`Updated ${entry.article} (${entry.images.length} image(s))`);
  }

  const allSources = fs
    .readdirSync(SOURCE_DIR)
    .filter((f) => /\.(png|jpe?g|gif|webp)$/i.test(f));

  const unused = allSources.filter((f) => !usedSources.has(f));
  const duplicateGroups = groupDuplicates(SOURCE_DIR);

  fs.writeFileSync(
    REPORT,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        sourceDir: SOURCE_DIR,
        installed,
        duplicateGroups,
        unused,
      },
      null,
      2
    ),
    "utf8"
  );

  console.log(`\nInstalled ${installed.length} images → ${OUTPUT_DIR}`);
  console.log(`Unused source files: ${unused.length} (resized duplicates / extras)`);
  console.log(`Report: ${REPORT}`);
}

main();
