var config = require('../config');
var Entry = require('../models/entry');
var desk = require('../lib/desk');
var buildEntry = require('../lib/buildEntry');
var logger = require('winston');


module.exports = function(app, express) {

  // Auth middleware
  var basicAuth = require('./middleware/basicAuth')(express);

  // New entry receive hook
  app.post('/entry/receive', basicAuth, function(req, res) {
    var data = JSON.parse(req.body.data);

    // Create a new entry for the db
    var entry = buildEntry.db(data);

    // Save to db
    new Entry(entry).save(function(err) {
      if (err) {
        logger.warn(err);
      } else {
        logger.info('record saved: ' + entry.topic_display);
      }
    });
  });

  app.post('/entry/submit', basicAuth, function(req, res) {

    // Create the case object
    var entry = buildEntry.desk(req.body);

    // Get a customer record
    desk.findOrCreateCustomer(req.body, function(err, customerLink) {

      if (err) {
        logger.error(err);
        res.send(400, err.message);
        return;
      }

      // Assign the customer record to the case
      entry._links.customer.href = customerLink;

      // Create a new case
      desk.createCase(entry, function(err) {

        if (err) {
          logger.error(err);
          res.send(400, err.message);
          return;
        }

        res.send(200, 'Case Created');
      });
    });

  });


};
