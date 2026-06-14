---
id: 54
slug: til-we-can-compare-versions-in-ruby-using-gem-version-without-any-gems
title: "TIL we can compare versions in Ruby using `Gem::Version` without any gems"
date: 2022-04-29
layout: layouts/article.njk
permalink: /articles/54-til-we-can-compare-versions-in-ruby-using-gem-version-without-any-gems/
tags:
  - articles
---
We can just do   
  

```
Gem::Version.new('1.0.1') > Gem::Version.new('1.0.0')
```

  
  
Here is the link to the documentation: [https://ruby-doc.org/stdlib-3.1.0/libdoc/rubygems/rdoc/Gem/Version.html](https://ruby-doc.org/stdlib-3.1.0/libdoc/rubygems/rdoc/Gem/Version.html)
