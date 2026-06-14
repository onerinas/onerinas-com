---
id: 60
slug: til-how-to-select-values-from-one-column-without-nil-in-rails
title: TIL how to select values from one column without `nil` in Rails
date: 2022-01-23
topic: til
layout: layouts/article.njk
permalink: /articles/60-til-how-to-select-values-from-one-column-without-nil-in-rails/
tags:
  - articles
---
**Update:**  
  
There is a better way to do this as [discussed here in Twitter](https://twitter.com/overstimulat3d/status/1485555993790590976?s=20)  
  

```
Page.where.not(custom_domain: nil).pluck(:custom_domain)
```

  
  
---------------------------------------  
  

```
Page.pluck(:custom_domain)
    

  
      ![](/images/articles/60-til-how-to-select-values-from-one-column-without-nil-in-rails-1.png)

  

      screenshot from rails console
  
`.pluck` picks values but includes `nil` as well. So we can use `.compact`

  

```
Page.pluck(:custom_domain).compact
    

  
      ![](/images/articles/60-til-how-to-select-values-from-one-column-without-nil-in-rails-2.png)

  

      screenshot from rails console
  
```
```
