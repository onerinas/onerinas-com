---
id: 3
slug: why-and-how-i-built-highscore-domains
title: Why and how I built HIGHSCORE.domains
date: 2021-06-30
layout: layouts/article.njk
permalink: /articles/3-why-and-how-i-built-highscore-domains/
tags:
  - articles
---
My last post was about building side projects and I did it. Yes, built and launched a project. It's called [HIGHSCORE.domains](https://highscore.domains/?ref=hey_world)  
  
HIGHSCORE.domains is launched as a fun leaderboard to find out who owns more domains.  
  

# **Why I built it?**

As soon as I started working on projects, I saw a pattern. I keep buying domains thinking its the next big thing and people are gonna love it. Guess what? Nope.  
  
Then I thought, let's make a website to see how many domains people own. This time, I didn't buy a domain. Created a form using Typeform and tweeted it. Started seeing responses and then based on the response, I built a site in rails quickly and added the responses there.  
  
Soon people were able to enter their domain count directly on the leaderboard. For verifying domain count, you would have to tweet or send a DM screenshot of your domain registrar's dashboard to [@onerinas](https://twitter.com/onerinas).  
  
I think it got spread because few people started to tweet the screenshot and others noticed it. The main reason I asked to do that is there is no functionality built to upload screenshot. That turned out to be a good problem to have 😁  
  
**This is how it looked:  
**

![](/images/articles/3-why-and-how-i-built-highscore-domains-1.png)

b850e48e89f6079caf6215808cdd9f02.png 97.3 KB

# Product Hunt Launch

Soon after that I launched on Product Hunt: [https://www.producthunt.com/posts/highscore-domains](https://www.producthunt.com/posts/highscore-domains)  
It wasn't a planned launch and still got the 10th position and got featured on their newsletter.   
  
It gave me a boost and started working working on some tools for someone who owns domains. Goal is to build tools like:

-   Website monitoring
    -   Get an alert when your website goes down or SSL is about to expire
-   Early access page
    -   Coming soon pages for domain names with few clicks and having an ability to collect emails.
    -   So that next time I have a project idea, 
        -   I can just buy the domain, 
        -   connect it to HIGHSCORE.domains, 
        -   switch it to "Early access" mode 
        -   and it would automatically show a landing page with early access form to fill in. 
            -   (As you already know, I have couple of domains already bought and setting up convertkit was not something I want to do again to collect emails.)
-   Automated lighthouse score monitoring
    -   I often end up checking the lightscore score on web.dev and gtmetrix.com so it would be cool to automate this and send me email once in a while

  

# Product Strategy

  
Since these features took some time to build, I added a page for showcasing customers's domain name. So that whoever signed up so far and on the leaderboard can showcase their domain names. This would also mean when the above features are ready, I know who to reach out. The domain names which doesn't have a landing page.  
  
  
Right now the website has two section:

-   People leaderboard: A fun leaderboard to find out who owns more domains.
-   Domains leaderboard: A leaderboard for domains based on views, visits, like and other metrics  
      
    

Once the above tools are ready for public planning to do another launch: **HIGHSCORE.domains Backstage**

-   Backstage: A set of tools for domain owners. (ie, website monitoring, collect emails from customers for upcoming projects, etc)

  
**This is how it looks now:**

![](/images/articles/3-why-and-how-i-built-highscore-domains-2.png)

Screenshot 2021-06-30 at 10.15.16 PM.png 108 KB

![](/images/articles/3-why-and-how-i-built-highscore-domains-3.png)

Screenshot 2021-06-30 at 10.15.36 PM.png 106 KB

Any thoughts? reply to this email (if you received this via email) or just write to me at [[email protected]](/cdn-cgi/l/email-protection#9ae8f3f4fbe9daf2ffe3b4f9f5f7) if you are reading this online. Not an email person? I'm (trying to be) on Twitter if it's a Saturday: [https://twitter.com/onerinas](https://twitter.com/onerinas)
