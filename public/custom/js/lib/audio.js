// Modules
var countdown = require('./countdown.js');

exports.init = function($clip) {
  var $audio = $clip.find('audio');
  var $countdown = $clip.find('.countdown');

  // In seconds

  var startTime = parseInt($audio.attr('data-start-time'), 10);
  var endTime = parseInt($audio.attr('data-end-time'), 10);
  var duration = endTime - startTime;

  // Initialize the countdown
  countdown.init($countdown, duration * 1000, function() {
    //stop the audio automatically and reset everything
  });

  // Set the play position once the audio file is ready
  $audio.on('canplay', function() {
    $(this)[0].currentTime = startTime;
    $(this)[0].pause();
  });

  $audio.on('play', function() {
    countdown.resume($countdown);
  });

  $audio.on('pause', function() {
    countdown.pause($countdown);
  });

  // Stop the clip once the duration has elapsed
  $countdown.on('runnerFinish', function() {
    $audio[0].pause();
  });
};
