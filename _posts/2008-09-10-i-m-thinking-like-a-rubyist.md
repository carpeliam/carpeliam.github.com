---
layout: post
title: I'm thinking like a rubyist
---

I've been feeling the urge to blog about some of the code stuff I've been working on. So, after taking a little while to install a [code highlighter](http://coderay.rubychan.de/) on my [carpeliam.com blog](/), I'm ready to get started.

On [HungryWorcester.com](http://www.hungryworcester.com), we're trying hard to integrate mobile capabilities into the website. This starts with serving a version of the site to phones that doesn't include a ton of graphics, css, or javascript. Thanks to the popular [mobile_fu](http://www.intridea.com/2008/7/21/mobilize-your-rails-application-with-mobile-fu) plug-in, this is possible. But inevitably, because I'm doing most of my development on a desktop machine and not a mobile phone, I forget to make equivalent views for the mobile site. Because I'm viewing the site through firefox, I rarely ever detect a problem, until somebody else says "Hey, is page x supposed to work on the mobile site?"

Of course, like every other coder out there, I'm diligently using TDD. (You are using TDD, aren't you?) But writing tests for the mobile site is a pain, and I haven't been doing it.

I figured it was time to find a way, and so I set out to do some mobile testing.

Unit testing in Ruby is pretty similar to most other languages: you've got your setup, your test method that starts with the word "test", and your teardown. I wanted to take certain tests that were already running and run them again in the context of a mobile session. First, I had to figure out a way to emulate a mobile session. That's easy.

```ruby
def set_mobile
  @request.env['HTTP_USER_AGENT'] = 'nokia' # or any other random phone
end
```

Calling this method at the beginning of my test will run the rest of the test within a mobile context, like this:

```rb
def test_mobile_should_allow_signup
  set_mobile
  test_should_allow_signup
end
```

But I don't want to write this block for every single mobile test, that would take forever. And then I wouldn't have time to blog about it afterwards. I knew that in Java/JUnit, you can wrap your tests in a test suite, and use annotations to describe which tests should be run under which contexts. But Ruby doesn't have annotations, as far as I know.

I guess that's because it's not the Ruby Way. So I thought about it: what is the Ruby way? doesn't Ruby have some really great metaprogramming options? Turns out, it does. In Ruby, it's easy to add methods at runtime. How easy? This easy:

```rb
def self.add_methods_to_mobile_tests args
  args.each do | method_name |
    define_method "test_mobile_#{method_name}" do
      set_mobile
      eval("test_#{method_name}")
    end
  end
end

require File.dirname(__FILE__) + '/../test_helper'
class UsersControllerTest < ActionController::TestCase
  add_methods_to_mobile_tests %w( should_allow_signup should_require_login_on_signup )
  #... a bunch of tests
end
```

This way, it's as easy to test functionality in a mobile browser as adding the test name to an array. I probably could find a way to refer to these methods as actual methods instead of strings, which would make it a little bit less error-prone, but this is good enough for me. All in all, it makes the tests more robust, it cuts down on the amount of coding I have to do, and makes us all happier people.
