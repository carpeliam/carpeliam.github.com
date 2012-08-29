$(document).ready(function() {
  // search form
  $("#search input").focus(function() {
    $(this).addClass("focus"); // because IE doesn't like :focus
    if ($(this).closest("form").children("input[type=submit]").length == 0) {
      if ($(this).val() == 'Search') {
        $(this).val("");
      }
      $(this).after('<input type="submit" value="go" />');
    }
  });
  
  $("#search input").blur(function() {
    if ($(this).val() == "") {
      $(this).removeClass("focus"); // because IE doesn't like :focus
      $(this).val("Search");
      $(this).closest("form").children("input[type=submit]").remove();
    }
  });
  
  // tool tip
  $("nav a").tooltip({
    track: true,
    showURL: false,
    bodyHandler: function() {
      return $($(this).closest('li').children(".tooltip")).html();
    }
  });
  
  $('#article_tag_list').bind("keydown", function(event) {
    if (event.keyCode === $.ui.keyCode.TAB && $(this).data("autocomplete").menu.active)
      event.preventDefault();
  }).autocomplete({
    source: function(request, response) {
      $.getJSON("/articles/tags/query", {query: request.term.split(/,\s*/).pop()}, response);
    },
    search: function() {
      var term = this.value.split(/,\s*/).pop();
      if (term.length < 2)
        return false;
    },
    focus: function() {
      return false;
    },
    select: function(event, ui) {
      var terms = this.value.split(/,\s*/);
      // remove the current input
      terms.pop();
      // add the selected item
      terms.push(ui.item.value);
      // add placeholder to get the comma-and-space at the end
      terms.push('');
      this.value = terms.join(", ");
      return false;
    }
  });
  
  var cache = new LastFMCache();
  var lastfm = new LastFM({apiKey: 'b44f47f324f77489475e2a7542932da6', cache: cache});
  lastfm.user.getRecentTracks({user:'carpeliam'}, {
    success: function(data) {
      var tracks = data.recenttracks.track;
      var list = $('<ul id="lastfm_tracks"/>').insertAfter($('#lastfm'));
      for (var i in tracks) {
        var date = new Date(tracks[i].date.uts * 1000);
        $('#sideItemTemplate').tmpl({
          title: tracks[i].artist['#text'] + ' &ndash; ' + tracks[i].name,
          url: tracks[i].url,
          time: date.toISOString(),
          date: date.toString()
        }).appendTo(list);
      }
      list.find('time').timeago();
    },
    error: function(code, message) {
      $('<div class="error"/>').text(message).insertAfter($('#lastfm'));
    }
  });
  
  $.ajax({
    url: 'http://feeds.delicious.com/v2/json/carpeliam?count=5',
    dataType: 'jsonp',
    success: function(data) {
      var list = $('<ul id="delicious_bookmarks"/>').insertAfter($('#delicious'));
      for (var i in data) {
        $('#sideItemTemplate').tmpl({
          title: data[i].d,
          url: data[i].u,
          time: data[i].dt,
          date: $.timeago.parse(data[i].dt).toString()
        }).appendTo(list);
      }
      list.find('time').timeago();
    },
    error: function(jqXHR, textStatus, errorThrown) {
      $('<div class="error"/>').text('Unable to retrieve bookmarks.').insertAfter($('#delicious'));
    }
  });
});