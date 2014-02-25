module.exports = function(app) {

  // Index Page
  app.get('/', function(req, res) {
    res.render('index');
  });

};
