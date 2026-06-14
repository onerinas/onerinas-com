---
id: 43
slug: til-in-rails-how-to-change-column-defaults-with-from-and-to-option-for-making-it-a-reversible-migration
title: "TIL in Rails: How to change column defaults with :from and :to option for making it a reversible migration"
date: 2024-01-25
layout: layouts/article.njk
permalink: /articles/43-til-in-rails-how-to-change-column-defaults-with-from-and-to-option-for-making-it-a-reversible-migration/
tags:
  - articles
---
I was trying to change a column default 

```
def change
  change_column_default :blog, :language, "en_US"
end
```

  
  
and it gave this error when I try to rollback the migration

```
Caused by:
ActiveRecord::IrreversibleMigration:

change_column_default is only reversible if given a :from and :to optio
```

Learned that we can pass :from and :to option there.   
  
  
SOLUTION:  
  

```
def change
  change_column_default :blog, :language, from: "en", to: "en_US"
end
```
