$(function() {
  // search form
  $("#search input").focus(function() {
    $(this).addClass("focus"); // because IE doesn't like :focus
    if (!$(this).closest("form").children("input[type=submit]").length) {
      $(this).after('<input type="submit" value="go">');
    }
  }).blur(function() {
    if ($(this).is(':empty')) {
      $(this).removeClass("focus"); // because IE doesn't like :focus
      $(this).closest("form").children("input[type=submit]").remove();
    }
  });
  
  // tool tip
  $('nav a').popover({html: true, placement: 'top', trigger: 'hover focus'});
  
  // side bar
  var sideItemTemplate = _.template($('#sideItemTemplate').html());

  SC.initialize({ client_id: '65e74ad7cc2b23eea893e18743d45f74' });
  SC.get('/users/6867700/tracks', {limit: 20}, function(tracks, error) {
    if (error) {
      if (typeof console !== 'undefined' && console !== null) {
        console.log('SoundCloud: ' + error.message);
      }
      return;
    }
    var $player = $('<div>').insertAfter('#soundcloud');
    var $list = $('<ul id="soundcloud_tracks">').insertAfter($player);
    for (var i in tracks) {
      var date = new Date(tracks[i].created_at);
      var $track = $(sideItemTemplate({
        title: tracks[i].title,
        url: tracks[i].permalink_url,
        time: date.toISOString(),
        date: date.toString()
      }));
      $track.find('a').on('click', function(e) {
        e.preventDefault();
        SC.oEmbed($(this).attr('href'), { auto_play: true, color: '#5b8bc6', maxheight: 115, show_artwork: false }, function(oEmbed) {
          $player.html(oEmbed.html);
        });
      });
      $list.append($track);
    }
    $list.find('time').timeago();
  });
  
  $.getJSON('http://feeds.delicious.com/v2/json/carpeliam?count=5&callback=?').done(function(data) {
    var $list = $('<ul id="delicious_bookmarks"/>').insertAfter($('#delicious'));
    for (var i in data) {
      $list.append(sideItemTemplate({
        title: data[i].d,
        url: data[i].u,
        time: data[i].dt,
        date: $.timeago.parse(data[i].dt).toString()
      }));
    }
    $list.find('time').timeago();
  }).fail(function(jqXHR, textStatus, errorThrown) {
    $('<div class="error"/>').text('Unable to retrieve bookmarks.').insertAfter($('#delicious'));
  });
});