var fs = require('fs');
var config = require('../../config');
var feed = require('../../lib/feed');
var _ = require('lodash');
var logger = require('winston');

module.exports = function(req, res, next) {

  // Array of pertinent episode details
  // req.episodeDetails;

  // Array of topic topicEntries
  // req.topicEntries;

  // make a data structure that looks like this:
  var topicCollection = {
    topic: res.topicEntries[0].topic_display,
    data: []
  };

  for (var i = 0; i < res.episodeDetails.length; i++) {
    var collection = {};
    collection.episode = res.episodeDetails[i];

    // Find all the topic instances that reference this episode
    var topics = _.filter(res.topicEntries, function(topic) {
      return topic.episode_number === collection.episode.episode_number;
    });

    collection.appearances = topics;
    topicCollection.data.push(collection);
  }

  res.topicCollection = topicCollection;
  next();
};
