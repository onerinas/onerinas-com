---
id: 33
slug: til-how-to-create-new-session-in-tmux-and-use-it-later
title: "TIL: How to create new session in tmux and use it later"
date: 2025-03-12
layout: layouts/article.njk
permalink: /articles/33-til-how-to-create-new-session-in-tmux-and-use-it-later/
tags:
  - articles
---
To create a new session in tmux

```
tmux new -s sessionname
```

  
Detach from the session

```
crtl + b and then press d
```

  
Then we can go back to it (attach) to it using below command

```
tmux attach-session -t sessionname
```

  

We can do both in one command using. i.e Attach if exists, create if it does not exist.

```
tmux new-session -A -s sessionname
```
