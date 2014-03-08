var getEpisodeList = require('./middleware/getEpisodeList');

module.exports = function(app) {

  // Index Page
  app.get('/', function(req, res) {
    res.render('index');
  });

  app.get('/entry', function(req, res) {
    res.render('entry');
  });

  app.get('/submit', getEpisodeList, function(req, res) {
    res.render('submit', {
      episodes: req.episodes
    });
  });

};
