var mongoose = require('mongoose');
var Entry = mongoose.model('Entry');

module.exports = function(req, res, next) {

  Entry.find({
    topic_slug: req.params.topicSlug
  }, function(err, topics) {

    if (err) {
      res.send(500, err);
    }

    if (topics.length <= 0) {
      res.send(404);
    }

    res.topicEntries = topics;
    next();
  });
};
