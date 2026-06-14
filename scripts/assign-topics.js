#!/usr/bin/env node
/**
 * Assign topic (til | notes) to article front matter from title.
 *
 * TIL: title starts with "TIL" (word boundary).
 * Everything else: notes.
 *
 * Run: npm run assign:topics
 */

const fs = require("fs");
const path = require("path");

const ARTICLES_DIR = path.join(__dirname, "..", "src", "articles");

function inferTopic(title) {
  const normalized = String(title).replace(/^["']|["']$/g, "").trim();
  return /^TIL\b/i.test(normalized) ? "til" : "notes";
}

function upsertTopic(frontMatter, topic) {
  if (/^topic:/m.test(frontMatter)) {
    return frontMatter.replace(/^topic:.*$/m, `topic: ${topic}`);
  }

  return frontMatter.replace(/^(date:.*)$/m, `$1\ntopic: ${topic}`);
}

function main() {
  const files = fs
    .readdirSync(ARTICLES_DIR)
    .filter((name) => name.endsWith(".md"))
    .sort();

  let til = 0;
  let notes = 0;

  for (const filename of files) {
    const filePath = path.join(ARTICLES_DIR, filename);
    const content = fs.readFileSync(filePath, "utf8");
    const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

    if (!match) {
      throw new Error(`Missing front matter: ${filename}`);
    }

    const [, frontMatter, body] = match;
    const titleMatch = frontMatter.match(/^title:\s*(.+)$/m);

    if (!titleMatch) {
      throw new Error(`Missing title: ${filename}`);
    }

    const title = titleMatch[1].trim();
    const topic = inferTopic(title);
    const updatedFrontMatter = upsertTopic(frontMatter, topic);
    const updated = `---\n${updatedFrontMatter}\n---\n${body}`;

    fs.writeFileSync(filePath, updated, "utf8");

    if (topic === "til") {
      til += 1;
    } else {
      notes += 1;
    }
  }

  console.log(`Assigned topics for ${files.length} articles (${til} TIL, ${notes} Notes)`);
}

main();
