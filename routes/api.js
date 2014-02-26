var config = require('../config');
var Entry = require('../models/entry');
var desk = require('../lib/desk');
var logger = require('winston');


module.exports = function(app, express) {

  // Auth middleware
  var basicAuth = require('./middleware/basicAuth')(express);

  // New entry receive hook
  app.post('/entry/receive', basicAuth, function(req, res) {

    logger.info('WEBHOOK RECEIVE', req.body);

    // Save the entry to the database
    // var entry = {
    //   topic: req.body.topic,
    //   episode_number: req.body.episode_number,
    //   time_start: req.body.time_start,
    //   time_stop: req.body.time_stop,
    //   author_name: req.body.author_name,
    //   author_link: req.body.author_link
    // };

    // new Entry(entry).save();
  });

  app.post('/entry/submit', basicAuth, function(req, res) {

    // Create the case object
    var entry = {
      subject: 'Some Subject',
      priority: 5,
      description: 'Some Description',
      status: 'new',
      type: 'email',
      labels: ['Submission'],
      custom_fields: {},
      message: {
        to: 'jon@linesandwaves.com',
        direction: 'in',
        status: 'received',
        body: 'Some Body',
        subject: 'Some Subject'
      },
      _links: {
        customer: {
          href: '',
          'class': 'customer'
        }
      }
    };

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
