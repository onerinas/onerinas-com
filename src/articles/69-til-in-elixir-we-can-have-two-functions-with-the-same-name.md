---
id: 69
slug: til-in-elixir-we-can-have-two-functions-with-the-same-name
title: "TIL in Elixir: We can have two functions with the same name"
date: 2026-05-01
layout: layouts/article.njk
permalink: /articles/69-til-in-elixir-we-can-have-two-functions-with-the-same-name/
tags:
  - articles
---
TIL in Elixir we can have two functions with the same name, as long as the number of arguments is different.  
  
For example:

-   `TaskList.list(10)` -> all tasks for user 10
-   `TaskList.list(10, 100)` -> tasks for user 10 in project 100

So `list/1` and `list/2` are treated as different functions.

```
defmodule TaskList do
  def list(user_id) do
    [
      %{id: 1, title: "Write docs", user_id: user_id, project_id: 100},
      %{id: 2, title: "Fix bug", user_id: user_id, project_id: 200}
    ]
  end

  def list(user_id, project_id) do
    list(user_id)
    |> Enum.filter(fn task -> task.project_id == project_id end)
  end
end
```

  
Also, coming from Ruby, "name/arity" notation is new to me. Apparently, that's how functions are referred to everywhere in Elixir.
