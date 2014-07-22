require('../../../components/jquery-runner/build/jquery.runner.js');

exports.init = function($countdown, duration, callback) {

  $countdown.runner({
    autostart: false,
    countdown: true,
    startAt: duration,
    stopAt: 0,
    milliseconds: false,
    format: function(value) {
      return msToMMSS(value);
    }
  });
};

exports.resume = function($countdown) {
  $countdown.runner('start');
};

exports.pause = function($countdown) {
  $countdown.runner('stop');
};

var msToMMSS = function(ms) {
  var date = new Date(ms);

  var hh = date.getUTCHours();
  var mm = date.getUTCMinutes() + (hh * 60);
  var ss = date.getUTCSeconds();

  if (mm < 10) {
    mm = '0' + mm;
  }

  if (ss < 10) {
    ss = '0' + ss;
  }

  return mm + ':' + ss;
};