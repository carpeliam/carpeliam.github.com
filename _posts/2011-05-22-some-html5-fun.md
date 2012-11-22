---
layout: post
title: some html5 fun
---

In a recent HTML5 class, I got to play around with some cool new technologies, including canvas, geolocation, html5 forms/markup, and [others](http://diveintohtml5.org/). Here's one little thing I created.

<script type="text/javascript" src="/js/processing-1.1.0.js"></script><script type="text/javascript" src="/js/html5canvas.js"></script>
<input type="number" max="20" min="1" id="count" value="4" /><button id="record">Record</button><button id="play">Play</button><button id="stop">Stop/Rewind</button>
<canvas data-processing-sources="/c2.pjs" style="cursor: crosshair; border: 1px solid gold"></canvas>

It uses [processing.js](http://processingjs.org/) to do the actual canvas drawing, local storage to manage the recording/playback, the new 'number' HTML5 input type, and some jQuery/math to glue it all together.

You can use the input to increase/decrease the number of bars attached to the cross, and you can use the mousewheel to make it grow or shrink.
