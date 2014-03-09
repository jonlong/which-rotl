var fs = require('fs');
var feed = require('../../lib/feed');
var _ = require('lodash');
var logger = require('winston');

module.exports = function(req, res, next) {

  // Get the unique episode numbers
  var topicEpisodeNumbers = _.map(res.topicEntries, function(topic) {
    return topic.episode_number;
  });
  topicEpisodeNumbers = _.uniq(topicEpisodeNumbers);

  // Fetch the episode list
  feed.listEpisodes(function(err, episodes) {
    if (err) {
      logger.error(err);
      res.send(500, err);
    }

    // Get the details for each topic episode
    var topicEpisodes = _.filter(episodes, function(episode, index) {
      episode.episode_number = index;
      return topicEpisodeNumbers.indexOf(index) > -1;
    });

    res.episodeDetails = topicEpisodes;
    next();
  });
};
