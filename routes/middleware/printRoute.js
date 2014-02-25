// Simple middleware example

module.exports = function(req, res, next) {

  if (req.route) {
    console.log('Current Route', req.route.path);
    next();
  } else {
    res.json({
      result: 'error',
      msg: 'no route present'
    });
  }
};
