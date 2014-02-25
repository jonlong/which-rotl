var _ = require('lodash');
var fs = require('fs');

module.exports = (function(env) {

  // Set Defaults
  var defaults = {
    env: process.env.NODE_ENV || 'development',
    web: {
      port: process.env.WEB_PORT || 3000
    },
    api: {
      username: process.env.API_USERNAME,
      password: process.env.API_PASSWORD
    }
  };

  var envConfigPath = __dirname + '/' + defaults.env + '.js';

  // Load an env-specific file, if it exists
  if (fs.existsSync(envConfigPath)) {
    var environment = require(envConfigPath);
    console.log('Loaded environment config for ' + defaults.env + '.');
  } else {
    console.log('Environment config for ' + defaults.env + ' not found.');
  }

  // Overwrite defaults with env-specific properties
  return _.merge(defaults, environment);
})();
