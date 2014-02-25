var config = require('../config');

module.exports = function(app, express) {

  // Auth middleware
  var basicAuth = require('./middleware/basicAuth')(express);

  // New entry receive hook
  app.post('/entry/receive', basicAuth, function(req, res) {
    console.log('BODY', req.body);
  });

  app.post('/entry/new', function(req, res) {
    console.log('BODY', req.body);
  });


};
