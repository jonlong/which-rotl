var fs = require('fs');
var config = require('../config');
var logger = require('winston');
var request = require('request');
var _ = require('lodash');

module.exports = {

  fetch: function(callback) {
    request({
      url: 'https://ajax.googleapis.com/ajax/services/feed/load',
      qs: {
        v: '1.0',
        output: 'json',
        q: 'http://feeds.feedburner.com/RoderickOnTheLine',
        num: 250,
        scoring: 'h'
      }
    }, function(err, res, body) {

      if (err) {
        return callback(err);
      }

      var json = body;
      var data = JSON.parse(body);

      if (data.responseDetails === 'Feed could not be loaded.') {
        return callback(null, data.responseDetails);
      }

      return callback(null, json);
    });
  },

  fetchAndSave: function(callback) {
    var self = this;

    self.fetch(function(err, feed) {

      if (err) {
        return callback(err);
      }

      fs.writeFile(config.data.path, feed, function(err, data) {
        if (err) {
          return callback(err);
        }
        logger.info('Feed fetched and written to disk at ' + new Date());

        return callback(null, feed);
      });
    });
  },

  listEpisodes: function(callback) {
    fs.readFile(config.data.path, function(err, data) {
      if (err) {
        return callback(err);
      }

      var feed = JSON.parse(data);
      var episodes = feed.responseData.feed.entries;
      episodes.reverse();

      return callback(null, episodes);
    });
  }
};
