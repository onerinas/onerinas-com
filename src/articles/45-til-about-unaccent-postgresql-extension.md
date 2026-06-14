---
id: 45
slug: til-about-unaccent-postgresql-extension
title: TIL about unaccent (PostgreSQL extension)
date: 2024-01-16
layout: layouts/article.njk
permalink: /articles/45-til-about-unaccent-postgresql-extension/
tags:
  - articles
---
> SQL unaccent is a PostgreSQL extension that removes accents (diacritic signs) from lexemes. It is a filtering dictionary that can be used to improve user experience and implement search in a user-friendly way. The unaccent() function removes accents from a given string and can be used outside normal text search contexts. For example, SELECT unaccent('unaccent', 'Hôtel') returns 'hotel'. The unaccent extension provides a single function, unaccent(), which can be used to remove accents from words. It can even be indexed using an unaccent-based index to speed up the process.

  
[Source: https://www.perplexity.ai/search/what-is-sql-wUfB7lcLSr.55d8_7ZnAFg?s=c](https://www.perplexity.ai/search/what-is-sql-wUfB7lcLSr.55d8_7ZnAFg?s=c)
