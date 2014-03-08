var cronJob = require('cron').CronJob;
var feed = require('./feed');
var logger = require('winston');
var config = require('../config');

var job = new cronJob({
  cronTime: config.data.cron,
  onTick: function() {
    feed.fetchAndSave(function(err, data) {
      if (err) {
        return logger.error('Error fetching/saving via cron');
      }

      logger.info('Feed fetched/saved via cron at ' + new Date());
    });
  },
  start: true
});

exports.start = function() {
  job.start();
};
