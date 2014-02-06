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
  var ModelItem = window.ModelItem = Backbone.Model.extend({
    parse: function(attrs) {
      for (var key in this.translations) {
        var orig = this.translations[key];
        attrs[key] = _(orig).isFunction() ? orig(attrs) : attrs[orig];
      }
      return attrs;
    }
  }),
  SoundCloudItem = window.SoundCloudItem = ModelItem.extend({
    translations: {url: 'permalink_url', date: function(attrs) { return new Date(attrs.created_at); }}
  }),
  LastFMItem = ModelItem.extend({
    translations: {
      title: function(attrs) { return attrs.artist['#text'] + ' &ndash; ' + attrs.name; },
      date:  function(attrs) { return new Date(attrs.date.uts * 1000); }
    }
  }),
  DeliciousItem = ModelItem.extend({
    translations: {title: 'd', url: 'u', date: function(attrs) { return new Date(attrs.dt); }}
  }),
  DailyMileItem = ModelItem.extend({
    translations: {title: function(attrs) { return attrs.workout.title; }, date: function(attrs) { return new Date(attrs.at); }}
  }),
  ItemCollection = Backbone.Collection.extend({
    comparator: function(item) { return -item.get('date').getTime(); },
    model: function(attrs, options) {
      var types = {
        soundcloud: SoundCloudItem,
        lastfm: LastFMItem,
        delicious: DeliciousItem,
        dailymile: DailyMileItem
      };
      attrs.itemType = options.itemType;
      var Item = types[attrs.itemType];
      return new Item(attrs, options);
    }
  }),
  ItemView = Backbone.View.extend({
    tagName: 'ul',
    className: 'activity-feed',
    template: _.template($('#sideItemTemplate').html()),
    initialize: function() {
      this.collection.on('add', this.render, this);
    },
    render: function() {
      this.$el.empty();
      var view = this;
      this.collection.each(function(item) {
        var context = _.extend({}, item.attributes, {time: item.get('date').toISOString(), date: item.get('date').toString()});
        view.$el.append(view.template(context));
      });
      this.$('time').timeago();
      return this;
    }
  });
  var sidebarItems = new ItemCollection, sidebarView = new ItemView({collection: sidebarItems});
  $('#sidebar').append(sidebarView.render().el);


  SC.initialize({ client_id: '65e74ad7cc2b23eea893e18743d45f74' });
  SC.get('/users/6867700/tracks', {limit: 20}, function(tracks, error) {
    if (error) {
      if (typeof console !== 'undefined' && console !== null) {
        console.log('SoundCloud: ' + error.message);
      }
    } else {
      sidebarItems.add(tracks, {parse: true, itemType: 'soundcloud'});
    }
  });

  var cache = new LastFMCache();
  var lastfm = new LastFM({apiKey: 'b44f47f324f77489475e2a7542932da6', cache: cache});
  lastfm.user.getRecentTracks({user:'carpeliam'}, {
    success: function(data) {
      sidebarItems.add(data.recenttracks.track, {parse: true, itemType: 'lastfm'});
    },
    error: function(code, message) {
      if (typeof console !== 'undefined' && console !== null) {
        console.log('SoundCloud: ' + message, code);
      }
    }
  });

  $.getJSON('http://feeds.delicious.com/v2/json/carpeliam?count=10&callback=?').done(function(data) {
    sidebarItems.add(data, {parse: true, itemType: 'delicious'});
  }).fail(function() {
    if (typeof console !== 'undefined' && console !== null) {
      console.log('Delicious: failure');
    }
  });

  $.getJSON('https://api.dailymile.com/people/carpeliam/entries.json?callback=?').done(function(data) {
    sidebarItems.add(data.entries, {parse: true, itemType: 'dailymile'});
  }).fail(function() {
    if (typeof console !== 'undefined' && console !== null) {
      console.log('DailyMile: failure');
    }
  });
});
