var config = require('../config');
var Desk = require('desk.js');

var desk = Desk.createClient({
  subdomain: 'whichrotl',
  username: config.desk.username,
  password: config.desk.password,
  // consumerKey: config.desk.consumerKey,
  // consumerSecret: config.desk.consumerSecret,
  // token: config.desk.token,
  // tokenSecret: config.desk.tokenSecret,
  logger: console,
  retry: true
});

var apiPath = '/api/v2';

var methods = {
  findCustomer: function(options, callback) {
    desk.get(apiPath + '/customers/search', options, function(err, json, response) {
      var customerLink;

      if (err) {
        callback(err);
      }

      if (json['total_entries'] > 0) {
        customerLink = json['_embedded']['entries'][0]['_links']['self'];
      }

      callback(null, customerLink);
    });
  },

  createCustomer: function(data, callback) {
    desk.post(apiPath + '/customers', data, function(err, json, response) {
      var customerLink;

      if (err) {
        callback(err);
      }

      if (!json['errors']) {
        customerLink = json['_links']['self']['href'];
      }

      callback(null, customerLink);
    });
  },

  createCase: function(data, callback) {
    desk.post(apiPath + '/cases', data, function(err, json, response) {
      var caseLink;

      if (err) {
        callback(err);
      }

      if (!json['errors']) {
        caseLink = json['_links']['self']['href'];
      }

      callback(null, caseLink);
    });
  },

  findOrCreateCustomer: function(data, callback) {

    methods.createCustomer({
      'emails': [{
        "type": "home",
        "value": data.email
      }],
      'first_name': data.first_name,
      'last_name': data.last_name
    }, function(err, customerLink) {

      if (err) {
        throw err;
      }

      if (!customerLink) {
        methods.findCustomer({
          'email': data.email
        }, function(err, customerLink) {
          if (err) {
            throw err;
          }

          callback(customerLink);
        });
      }
    });
  }
};

module.exports = methods;
