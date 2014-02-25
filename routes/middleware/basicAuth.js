var config = require('../../config');
var errorMessage = 'Unauthorized.';

module.exports = function(express) {
  return express.basicAuth(function(username, password) {
    return (username === config.api.username && password === config.api.password);
  }, errorMessage);
};
