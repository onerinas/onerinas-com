---
id: 35
slug: til-in-rails-how-to-check-which-database-a-model-is-connected-to-from-rails-console
title: TIL in rails how to check which database a model is connected to from rails console
date: 2024-11-13
topic: til
layout: layouts/article.njk
permalink: /articles/35-til-in-rails-how-to-check-which-database-a-model-is-connected-to-from-rails-console/
tags:
  - articles
---
```
ActiveRecord::Base.connection_db_config.name
```

  

```
Car.connection_db_config.name
Vehicle.connection_db_config.name
```

  
This is useful in scenarios where we have models connecting to different database and want to check them via rails console
