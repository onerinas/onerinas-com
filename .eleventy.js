const { DateTime } = require("luxon");
const yaml = require("js-yaml");

module.exports = function (eleventyConfig) {
  eleventyConfig.addDataExtension("yaml,yml", {
    parser: (contents) => yaml.load(contents),
  });

  eleventyConfig.addGlobalData("currentYear", () => new Date().getFullYear());
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/_redirects");

  eleventyConfig.addCollection("articles", (collectionApi) => {
    return collectionApi
      .getFilteredByTag("articles")
      .sort((a, b) => b.date - a.date);
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

  eleventyConfig.addFilter("topicLabel", (topic) => {
    switch (topic) {
      case "til":
        return "TIL";
      case "notes":
        return "Notes";
      default:
        return "";
    }
  });

  eleventyConfig.addFilter("byTopic", (items, topic) => {
    return items.filter((item) => item.data.topic === topic);
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
