#!/usr/bin/env node
/**
 * Remove spurious markdown escapes left by HTML→markdown import (Turndown).
 * Safe for technical blog content: restores _, [, ], `, *, #, -, ', etc.
 */

const fs = require("fs");
const path = require("path");

const ARTICLES_DIR = path.join(__dirname, "..", "src", "articles");

function unescapeMarkdown(text) {
  return (
    text
      .replace(/\\_/g, "_")
      .replace(/\\\[/g, "[")
      .replace(/\\\]/g, "]")
      .replace(/\\`/g, "`")
      .replace(/\\'/g, "'")
      .replace(/\\\*/g, "*")
      .replace(/\\#/g, "#")
      .replace(/^\\-/gm, "-")
      .replace(/\\==/g, "==")
      // horizontal rules written as \--- or \---------------------------------------
      .replace(/^\\-+/gm, (match) => match.slice(1))
  );
}

function fixBody(body) {
  const parts = body.split(/(```[\s\S]*?```)/g);
  return parts
    .map((part, index) => {
      // odd indices are fenced code blocks when split this way
      if (index % 2 === 1) {
        return unescapeMarkdown(part);
      }
      return unescapeMarkdown(part);
    })
    .join("");
}

function fixFile(filePath) {
  const original = fs.readFileSync(filePath, "utf8");
  const match = original.match(/^---\n[\s\S]*?\n---\n/);
  if (!match) {
    return false;
  }

  const frontMatter = match[0];
  const body = original.slice(frontMatter.length);
  const fixed = fixBody(body);

  if (fixed === body) {
    return false;
  }

  fs.writeFileSync(filePath, frontMatter + fixed, "utf8");
  return true;
}

function main() {
  const files = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".md"));
  let changed = 0;

  for (const file of files) {
    if (fixFile(path.join(ARTICLES_DIR, file))) {
      console.log(`Fixed ${file}`);
      changed += 1;
    }
  }

  console.log(`\nDone. Updated ${changed}/${files.length} articles.`);
}

main();
