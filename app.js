/**
 * Module dependencies.
 */

var express = require('express');
var swig = require('swig');
var app = express();

/**
 * Application
 */

// Load configuration
var env = process.env.NODE_ENV || 'development';
var config = require('./config');

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

// Start 'er up
app.listen(config.web.port);
console.log('Express app started on port ' + config.web.port);
