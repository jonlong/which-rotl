var config = require('../config');
var Entry = require('../models/entry');
var desk = require('../lib/desk');

module.exports = function(app, express) {

  // Auth middleware
  var basicAuth = require('./middleware/basicAuth')(express);

  // New entry receive hook
  app.post('/entry/receive', basicAuth, function(req, res) {
    var entry = {
      topic: req.body.topic,
      episode_number: req.body.episode_number,
      time_start: req.body.time_start,
      time_stop: req.body.time_stop,
      author_name: req.body.author_name,
      author_link: req.body.author_link
    };

    new Entry(entry).save();
  });

  app.post('/entry/new', basicAuth, function(req, res) {

    var entry = {
      external_id: null,
      subject: 'Some Subject',
      priority: 5,
      description: 'Some Description',
      status: 'new',
      type: 'email',
      labels: ['ignore', 'spam'],
      language: null,
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
    }
    desk.findOrCreateCustomer(req.body, function(customerLink) {

      console.log('customerLink', customerLink);

      // Set the customer link in the case body
      entry._links.customer.href = customerLink;

      desk.createCase(entry, function() {
        res.json({
          type: 'success',
          message: 'case created'
        });
      });
    });

  });


};
