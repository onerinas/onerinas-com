---
id: 38
slug: til-about-streaming-and-server-sent-event
title: TIL about Streaming and Server Sent Event
date: 2024-03-01
topic: til
layout: layouts/article.njk
permalink: /articles/38-til-about-streaming-and-server-sent-event/
tags:
  - articles
---
# Streaming

  

```
class MyController < ActionController::Base
  include ActionController::Live

  def stream
    response.headers['Content-Type'] = 'text/event-stream'
    100.times {
      response.stream.write "hello world\\n"
      sleep 1
    }
  ensure
    response.stream.close
  end
end
```

  

[https://guides.rubyonrails.org/action_controller_overview.html#incorporating-live-streaming](https://guides.rubyonrails.org/action_controller_overview.html#incorporating-live-streaming)

  

# Server Sent Events

  
  

```
**class MyController < ActionController::Base**
  include **ActionController::Live**

  **def** **index**
    response.headers['Content-Type'] = 'text/event-stream'
    sse = **SSE**.new(response.stream, **retry**: 300, event: "event-name")
    sse.write({ name: 'John'})
    sse.write({ name: 'John'}, id: 10)
    sse.write({ name: 'John'}, id: 10, event: "other-event")
    sse.write({ name: 'John'}, id: 10, event: "other-event", **retry**: 500)
  **ensure**
    sse.close
  **end**
**end**
```

  
  

[https://api.rubyonrails.org/classes/ActionController/Live/SSE.html](https://api.rubyonrails.org/classes/ActionController/Live/SSE.html)  
  
  

  

Example Usage of EventSource in JavaScript:  
[https://developer.mozilla.org/en-US/docs/Web/API/EventSource](https://developer.mozilla.org/en-US/docs/Web/API/EventSource)
