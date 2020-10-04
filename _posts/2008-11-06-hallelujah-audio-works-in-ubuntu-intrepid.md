---
layout: post
title: hallelujah, audio works in Ubuntu Intrepid
---

I recently installed Ubuntu, first to work on [Merb](http://www.merbivore.com) projects, then to work on [creating a virtual machine](https://help.ubuntu.com/community/JeOSVMBuilder) for [carpeliam.com](http://www.carpeliam.com). Now, I just plain like it.

But the difference between me now and me when I first tried Debian in college is I had a lot more time back then to fool with things if/when they didn't work. And for many people, unfortunately, Linux is still not something you can install and have it just work.

But after I convinced myself that a lack of good tunes was hurting my productivity, I spent hours on Google, in [#alsa](irc://freenode/#alsa) and in [#pulseaudio](irc://freenode/#pulseaudio) trying to figure out how to get audio to work in my Ubuntu Intrepid desktop. ([#ubuntu](irc://freenode/#ubuntu) has for the most part been useless to anyone asking a question that couldn't be answered by Google in 5 minutes.)

The first problem comes from the fact that there seem to be several places where you can set the default soundcard, not the first of which is Alsa's ~/.asoundrc. First, this seems to be completely independent of Gnome's "Multimedia Systems Selector" in System>Preferences, which isn't even visible by default (you need to enable it in the menu, but why would you, it doesn't seem to affect anything). But I won't cover either of those, because they both seemed irrelevant.

PulseAudio seemed to be the default, seemingly oblivious to the fact that nothing was pointing to it and asking it to play.

```sh
$ aplay /usr/share/sounds/question.wav
Playing WAVE '/usr/share/sounds/question.wav' : Signed 16 bit Little Endian, Rate 44100 Hz, Mono
ALSA lib pcm_pulse.c:629:(pulse_prepare) PulseAudio: Unable to create stream: Invalid argument
```

The first thing I tried to do was to get sound working without PulseAudio, but that wasn't working for me either. Apparently this is where things differ between me and the rest of the Ubuntu community- a lot of people leave PulseAudio, and things just "work". If anybody can tell me why what works for everybody else doesn't work for me, I'm really curious. But here's what I tried:

```sh
$ aplay -Dhw:0 /usr/share/sounds/question.wav
Playing WAVE '/usr/share/sounds/question.wav' : Signed 16 bit Little Endian, Rate 44100 Hz, Mono
aplay: set_params:954: Sample format non available
```

A few minutes in [#alsa](irc://freenode/#alsa) came back with a result: use ``plughw:0`` instead of ``hw:0``. (Didn't catch the reasoning behind this, something about "HDA codecs", somebody please enlighten me.)

At this point, my Google Radar is going off: if this is the _right_ solution, why doesn't Google mention it? Oh well, pushing forward--PulseAudio is still the default, and still giving me problems.

Two options: either uninstall PulseAudio, or try to figure it out. The guy in ``#alsa`` tells me to ask someone in either ``#ubuntu`` or ``#pulseaudio``; given my constant lack of success getting questions answered in ``#ubuntu``, I went to ``#pulseaudio``.

Commence hours of debugging with somebody who is probably a code committer with pulseaudio. (The guy in ``#alsa`` probably was too, it's definitely helpful when you go to the source.) Long story short: ``plughw`` is apparently the way to go.

All I needed to do to get pulseaudio to work for me is to create the following (in ``~/.pulse/default.pa``):

```sh
#!/usr/bin/pulseaudio -nF

.include /etc/pulse/default.pa

load-module module-alsa-sink device=plughw:M44 rate=44100 sink_name=delta44
set-default-sink delta44
```

This includes the system-level default config so nothing gets overwritten, and then loads a module that specifies my sound device using plughw. M44 is my device's name, but ``plughw:0`` could also work just as well, or insert-your-device-name-here. Name the sink whatever makes sense to you, just as long as the sink_name you give in line #5 matches the value in line #6.

I'm still kind of curious why I need to use plughw instead of hw--my gut tells me I'm somehow cheating the system--but now that sound works, I don't really care too much.
