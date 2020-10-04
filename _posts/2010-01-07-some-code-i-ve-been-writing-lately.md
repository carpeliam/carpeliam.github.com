---
layout: post
title: some code I've been writing lately
---

Update: Plogger has been renamed [Blugg](http://github.com/carpeliam/blugg), so as not to be confused with the open source PHP photo gallery. I'll most likely be rewriting Blugg as a Ruby Gem instead of a Rails plugin, but this change probably won't take place for a few weeks. Stay tuned!
Short version: I wrote a pluggable blogging system in Rails called [Plogger](http://github.com/carpeliam/plogger).

Long version: So, I've been working on updating my website lately, and I looked around to see what's currently going on with Rails blogging systems. When I first started getting into Rails, [Typo](http://wiki.github.com/fdv/typo/) was the only system out there. But I wanted to develop a Rails site myself, and Typo doesn't really make that easy. Neither does [Mephisto](http://mephistoblog.com/).

For this version of my site (published about [2 years ago]({% post_url 2008-01-28-a-blog-on-carpeliam-com-what-s-this %})), I wrote my own system, which has served me pretty well. 2 years later, I was hoping that Rails' options for blogging systems might have improved. Full-scale applications like Typo and Mephisto are still popular approaches, though I read a lot about [people who have used them](http://www.railsguru.com/articles/2009/01/21/typo-mephisto-wordpress/) [who](http://geekthang.com/blog/rails-out-go-wordpress/) [decide to switch](http://blog.codefront.net/2006/10/25/pfft-its-back-to-wordpress-for-me/) to [Wordpress](http://wordpress.org/) (because as much as we want to use Ruby/Rails software, we don't want to worry about our blog).

I also looked at [Bloggity](http://github.com/wbharding/bloggity), [Bloget](http://github.com/vigetlabs/bloget), and [Enki](http://github.com/xaviershay/enki), but they were either too opinionated for me, or did not concentrate on the feature set that I was most interested in (for example, allow guests to comment).

Seeing as how I'm on break right now, I decided to write my own blog plugin. I wanted to write a minimal system that did just what I wanted, but make it pluggable so that people who want additional features can easily add them. Enter [Plogger](http://github.com/carpeliam/plogger), and the first few [plugins](http://wiki.github.com/carpeliam/plogger/plugins) I've written for it. We'll see what happens.
