var fs = require('fs');
var config = require('../../config');
var feed = require('../../lib/feed');
var _ = require('lodash');
var logger = require('winston');
var cheerio = require('cheerio');

module.exports = function(req, res, next) {

  // Array of pertinent episode details
  // req.episodeDetails;

  // Array of topic topicEntries
  // req.topicEntries;

  // make a data structure that looks like this:
  var topicCollection = {
    topic: res.topicEntries[0].topic_display,
    appearances: 0,
    data: []
  };

  for (var i = 0; i < res.episodeDetails.length; i++) {
    var collection = {};
    collection.episode = res.episodeDetails[i];

    // The "content" value is a big HTML string with a bunch of freeform metadata for each episode.
    // This line extracts the image associated with each.
    var $ = cheerio.load(collection.episode.content);
    var image = $('img').first();
    collection.episode.image = {
      src: image.attr('src'),
      alt: image.attr('alt')
    };

    // Find all the topic instances that reference this episode
    var topics = _.filter(res.topicEntries, function(topic) {
      return topic.episode_number === collection.episode.episode_number;
    });

    collection.appearances = topics;
    topicCollection.appearances += collection.appearances.length;
    topicCollection.data.push(collection);
  }

  res.topicCollection = topicCollection;
  next();
};
