require('../../../components/jquery-runner/build/jquery.runner.js');

exports.init = function($countdown, duration, callback) {

  $countdown.runner({
    autostart: false,
    countdown: true,
    startAt: duration,
    stopAt: 0,
    milliseconds: false
  });
};

exports.resume = function($countdown) {
  $countdown.runner('start');
};

exports.pause = function($countdown) {
  $countdown.runner('stop');
};
