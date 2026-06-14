---
id: 34
slug: til-check-cache-exists-and-value-in-rails-console
title: "TIL: Check cache exists and value in rails console"
date: 2024-11-20
topic: til
layout: layouts/article.njk
permalink: /articles/34-til-check-cache-exists-and-value-in-rails-console/
tags:
  - articles
---
```
# Check if cache exists
Rails.cache.exist?('latest_posts')

# Read the current cached value
Rails.cache.read('latest_posts')

# Delete the cache if needed
Rails.cache.delete('latest_posts')
```
