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

  var cache = new LastFMCache();
  var lastfm = new LastFM({apiKey: 'b44f47f324f77489475e2a7542932da6', cache: cache});
  lastfm.user.getRecentTracks({user:'carpeliam'}, {
    success: function(data) {
      var tracks = data.recenttracks.track;
      var $list = $('<ul id="lastfm_tracks"/>').insertAfter($('#lastfm'));
      for (var i in tracks) {
        var date = new Date(tracks[i].date.uts * 1000);
        $list.append(sideItemTemplate({
          title: tracks[i].artist['#text'] + ' &ndash; ' + tracks[i].name,
          url: tracks[i].url,
          time: date.toISOString(),
          date: date.toString()
        }));
      }
      $list.find('time').timeago();
    },
    error: function(code, message) {
      $('<div class="error"/>').text(message).insertAfter($('#lastfm'));
    }
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