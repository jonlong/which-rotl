var config = require('../config');
var Desk = require('desk.js');
var _ = require('lodash');

var desk = Desk.createClient({
  subdomain: 'whichrotl',
  username: config.desk.username,
  password: config.desk.password,
  retry: true
});

var apiPath = '/api/v2';

var methods = {
  findCustomer: function(email, callback) {
    desk.get(apiPath + '/customers/search?email=' + email, function(err, json, response) {
      var customerLink;

      if (err) {
        return callback(json);
      }

      if (json.total_entries > 0) {
        customerLink = json._embedded.entries[0]._links.self;
      }

      callback(null, customerLink);
    });
  },

  createCustomer: function(data, callback) {
    desk.post(apiPath + '/customers', data, function(err, json, response) {
      var customerLink;

      if (err) {
        return callback(json);
      }

      customerLink = json._links.self.href;
      callback(null, customerLink);
    });
  },

  createCase: function(data, callback) {
    desk.post(apiPath + '/cases', data, function(err, json, response) {
      var caseLink;

      if (err) {
        return callback(json);
      }

      caseLink = json._links.self.href;
      callback(null, caseLink);
    });
  },

  findOrCreateCustomer: function(data, callback) {

    // First, try to create a new customer
    methods.createCustomer({
      'emails': [{
        "type": "home",
        "value": data.email
      }],
      'first_name': data.first_name,
      'last_name': data.last_name
    }, function(err, customerLink) {

      // If there is an error that is not an existing email address
      if (err & _.indexOf(err.errors.emails[0].value, 'taken') < 0) {
        return callback(err);
      }

      // If a customer link is returned
      if (customerLink) {
        return callback(null, customerLink);
      } else {
        // Customer exists, so find the customer record by email
        methods.findCustomer(data.email, function(err, customerLink) {
          if (err) {
            return callback(err);
          }

          callback(null, customerLink);
        });
      }
    });
  }
};

module.exports = methods;
