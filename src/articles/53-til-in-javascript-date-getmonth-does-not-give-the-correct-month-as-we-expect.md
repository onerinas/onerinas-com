---
id: 53
slug: til-in-javascript-date-getmonth-does-not-give-the-correct-month-as-we-expect
title: TIL in Javascript, Date `getMonth()` does not give the correct month as we expect 🤯
date: 2022-05-05
topic: til
layout: layouts/article.njk
permalink: /articles/53-til-in-javascript-date-getmonth-does-not-give-the-correct-month-as-we-expect/
tags:
  - articles
---
```
today = new Date()
Thu May 05 2022 19:28:34 GMT+0530 (India Standard Time)
today.getMonth()
4
```

  
what! it should be 5 (May!)  
  
looks like the return values are from 0 to 11  
  
so for now we'll have to do **today.getMonth() + 1** to get correct month value  
  
  
[https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getMonth#return_value](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getMonth#return_value)
