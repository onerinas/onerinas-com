---
id: 58
slug: til-in-rails-code-after-redirect_to-gets-executed
title: "TIL in Rails: Code after redirect_to gets executed"
date: 2022-02-06
topic: til
layout: layouts/article.njk
permalink: /articles/58-til-in-rails-code-after-redirect_to-gets-executed/
tags:
  - articles
---
Since it gets executed, we need to add `return`   
  

```
redirect_to url and return
```

  
Here is the issue which talks about this: [https://github.com/rails/rails/issues/26363](https://github.com/rails/rails/issues/26363)
