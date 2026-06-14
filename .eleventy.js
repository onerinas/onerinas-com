const { DateTime } = require("luxon");
const yaml = require("js-yaml");

require("dotenv").config();

module.exports = function (eleventyConfig) {
  eleventyConfig.addDataExtension("yaml,yml", {
    parser: (contents) => yaml.load(contents),
  });

  eleventyConfig.addGlobalData("currentYear", () => new Date().getFullYear());
  eleventyConfig.addGlobalData("env", () => ({
    fathomSiteId: process.env.FATHOM_SITE_ID,
    isProd: process.env.NODE_ENV === "production",
  }));
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/_redirects");

  eleventyConfig.addCollection("articles", (collectionApi) => {
    return collectionApi
      .getFilteredByTag("articles")
      .sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("sitemap", (collectionApi) => {
    return collectionApi.getAll().filter((item) => {
      if (!item.url || item.url === "/sitemap.xml" || item.url === "/robots.txt") {
        return false;
      }

      if (item.url.endsWith(".xml")) {
        return false;
      }

      return !item.data.eleventyExcludeFromCollections;
    });
  });

  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat(
      "d LLLL yyyy"
    );
  });

  eleventyConfig.addFilter("isoDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toISO();
  });

  eleventyConfig.addFilter("absoluteUrl", (url, base) => {
    try {
      return new URL(url, base).href;
    } catch {
      return url;
    }
  });

  eleventyConfig.addFilter("byTopic", (items, topic) => {
    return items.filter((item) => item.data.topic === topic);
  });

  eleventyConfig.addFilter("seoDescription", (value) => {
    const text = String(value).replace(/\s+/g, " ").trim();
    if (text.length <= 160) {
      return text;
    }

    return `${text.slice(0, 157).trimEnd()}…`;
  });

  eleventyConfig.addFilter("toJson", (value) => JSON.stringify(value));

  eleventyConfig.addFilter("ogImagePath", (url) => {
    if (url === "/") {
      return "/og/home.png";
    }

    const slug = url.replace(/^\/|\/$/g, "");
    return `/og/${slug}.png`;
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    pathPrefix: "/",
  };
};
