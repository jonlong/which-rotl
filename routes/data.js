var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var usersFile = path.join(__dirname + '/../data/users.json');
var encoding = 'utf8';

module.exports = function(app) {

  // Get users by id
  app.get('/users/:id', function(req, res) {
    var id = req.params.id;

    // Read from our data source
    fs.readFile(usersFile, encoding, function(err, data) {
      if (err) {
        throw err;
      }

      if (!id) {
        return res.json(data);
      }

      data = JSON.parse(data);

      var user = _.find(data, {
        id: id
      });

      res.json(user);
    });
  });

  // Confirm user is 21 or older
  app.post('/users/verifyAge', function(req, res) {
    var id = req.body.id;
    var response = {
      ofAge: false
    };

    // Read from our data source
    fs.readFile(usersFile, encoding, function(err, data) {
      if (err) {
        throw err;
      }

      data = JSON.parse(data);

      var user = _.find(data, {
        id: id
      });

      if (!user) {
        return res.json({
          result: 'error',
          msg: 'no user with that id'
        });
      }

      if (user.age >= 21) {
        response.ofAge = true;
      } else {
        response.ofAge = false;
      }

      res.json(response);
    });
  });

};
