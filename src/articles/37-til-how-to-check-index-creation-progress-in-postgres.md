---
id: 37
slug: til-how-to-check-index-creation-progress-in-postgres
title: TIL how to check index creation progress in postgres
date: 2024-09-17
topic: til
layout: layouts/article.njk
permalink: /articles/37-til-how-to-check-index-creation-progress-in-postgres/
tags:
  - articles
---
```
SELECT 
   (blocks_done::numeric / blocks_total::numeric) * 100 AS percentage_done
FROM     
   pg_stat_progress_create_index;
```

  

  
Got this from Stackoverflow: [https://stackoverflow.com/a/78640729](https://stackoverflow.com/a/78640729)  
  
Yes, it's from the good old stackoverflow :)
