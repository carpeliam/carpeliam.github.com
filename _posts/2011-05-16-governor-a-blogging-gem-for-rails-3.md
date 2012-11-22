---
layout: post
title: Governor&#58; a blogging gem for Rails 3
---

In the beginning, [dhh](http://twitter.com/#!/dhh) taught us how to [build a blog in 15 minutes](http://www.youtube.com/watch?v=Gzj723LkRJY). A few years ago, I was frustrated with the current toolset for creating a blog in Ruby on Rails, and so I decided to build a pluggable blogging system. That's when I ran into some Rails 2 monkey-patching issues and never got off the ground. Rails 3, however, allows me to do some seriously cool stuff, and I've retooled my previous effort to create [Governor](https://github.com/carpeliam/governor). Named after everybody's favorite governor, Rod Blagojevich.

Governor by itself is very bare: all it lets you do is post articles. Where it starts to get cool is when you start adding [plugins](https://github.com/carpeliam/governor/wiki/Plugins). At the moment, there are 9 plugins to choose from, giving you the ability to add an ATOM feed, comments, tags, draft/published states, or even announce your article to twitter, as you post it. (That twitter plugin is built on top of a middle-tier [governor_background](https://github.com/carpeliam/governor_background) plugin, which sends your post to twitter outside of your regular request cycle. It can sit on top of either [delayed_job](https://github.com/collectiveidea/delayed_job) or [resque](https://github.com/defunkt/resque).)

Governor will work with most authentication frameworks out of the box, including Devise, Authlogic, and Clearance. If you have different needs, just call ``rails generate governor:configure``, and you can redefine how authentication and authorization will work for your app.

This is my first foray into framework development, so I'm learning a lot. (If you see any issues or anti-patterns, please let me know!) There are a few plugins and features I'd like to implement in the future: better URLs for articles, a better system for blog administration, better asset management, better forms markup, better i18n support, and testing add-ons that can be reused across plugins. But one of the nice things about a pluggable open-source is that, if this is a pain point for someone else, they can extend it. If you end up using this or building on top of this, or if you run up against an issue or would like a feature, please let me know.

[governor](https://github.com/carpeliam/governor) on github
