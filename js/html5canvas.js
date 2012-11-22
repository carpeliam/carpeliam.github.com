$(document).ready(function() {
  window.lineCount = parseInt($('#count').val());
  
  localStorage['frameCount'] = 0;
  localStorage['currentFrame'] = 0;
  window.recording = false;
  window.playback = false;
  
  $('#count').change(function() {
    window.lineCount = parseInt($(this).val());
  });
  
  $('#record').click(function () {
    localStorage['frameCount'] = 0;
    localStorage['currentFrame'] = 0;
    window.recording = true;
    window.playback = false;
    console.log('recording');
  });
  
  $('#play').click(function () {
    localStorage['currentFrame'] = 0;
    window.recording = false;
    window.playback = true;
    console.log('playing back');
  });
  
  $('#stop').click(function () {
    localStorage['currentFrame'] = 0;
    window.recording = false;
    window.playback = false;
    console.log('stopping');
  });
});
