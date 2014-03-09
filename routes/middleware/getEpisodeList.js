var fs = require('fs');
var config = require('../../config');
var feed = require('../../lib/feed');
var _ = require('lodash');
var logger = require('winston');

module.exports = function(req, res, next) {

  feed.listEpisodes(function(err, episodes) {
    if (err) {
      logger.error(err);
      res.send(500, err);
    }

    var titles = _.map(episodes, function(episode) {
      return episode.title;
    });

    req.episodes = titles;
    next();
  });
};
