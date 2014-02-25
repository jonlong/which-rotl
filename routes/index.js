module.exports = function(app, express) {

  require('./site')(app);
  require('./api')(app, express);
};
