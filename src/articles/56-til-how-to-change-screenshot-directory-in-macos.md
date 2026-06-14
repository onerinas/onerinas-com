---
id: 56
slug: til-how-to-change-screenshot-directory-in-macos
title: TIL How to change screenshot directory in macOS
date: 2022-03-07
topic: til
layout: layouts/article.njk
permalink: /articles/56-til-how-to-change-screenshot-directory-in-macos/
tags:
  - articles
---
```
defaults write com.apple.screencapture location {location here}
```

  
e.g,   
  

```
defaults write com.apple.screencapture location /Users/rinas/Desktop/Screenshots
```
