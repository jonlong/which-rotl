/**
 * Module dependencies.
 */

var express = require('express');
var swig = require('swig');
var mongoose = require('mongoose');
var app = express();
var feed = require('./lib/feed');
var cron = require('./lib/cron');


/**
 * Application
 */

// Load configuration
var config = require('./config');

/* Database */
var connect = function() {
  var options = {
    server: {
      socketOptions: {
        keepAlive: 1
      }
    }
  };

  mongoose.connect('mongodb://' + config.db.username + ':' + config.db.password + '@' + config.db.host + ':' + config.db.port + '/' + config.db.name, options);
};
connect();

mongoose.connection.on('error', function(err) {
  console.log('Database connection error: ', err);
});

mongoose.connection.on('disconnected', function() {
  connect();
});

/* Express config */
app.engine('.html', swig.renderFile);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.set('view cache', false);
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(__dirname + '/public'));

swig.setDefaults({
  cache: false
});

// Routes
require('./routes')(app, express);

// Retrieve Feed data
feed.fetchAndSave(function() {
  // Initialize the cron
  cron.start();
});


// Start 'er up
app.listen(config.web.port);
console.log('Express app started on port ' + config.web.port);
