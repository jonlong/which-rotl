var getEpisodeList = require('./middleware/getEpisodeList');
var validateTopicSlug = require('./middleware/validateTopicSlug');
var getEpisodeDetails = require('./middleware/getEpisodeDetails');
var assembleTopicCollection = require('./middleware/assembleTopicCollection');

module.exports = function(app) {

  // Index Page
  app.get('/', function(req, res) {
    res.render('index');
  });

  app.get('/entry', function(req, res) {
    res.render('entry');
  });

  app.get('/topics', function(req, res) {
    res.render('topics');
  });

  app.get('/submit', getEpisodeList, function(req, res) {
    res.render('submit', {
      episodes: req.episodes
    });
  });

  app.get('/topics/:topicSlug', validateTopicSlug, getEpisodeDetails, assembleTopicCollection, function(req, res) {
    console.log(res.topicCollection);
  });

};
