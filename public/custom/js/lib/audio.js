// Modules
var countdown = require('./countdown.js');

exports.init = function($clip) {
  var $audio = $clip.find('audio');
  var $countdown = $clip.find('.countdown');

  // In seconds
  var startTime = parseInt($audio.attr('data-start-time'), 10);
  var endTime = parseInt($audio.attr('data-end-time'), 10);
  var duration = (endTime - startTime) * 1000;

  // Initialize the countdown
  countdown.init($countdown, duration);

  // Set the play position once the audio file is ready
  $audio.on('canplay', function() {
    console.log('startTime', startTime);
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
  $countdown.on('finish.countdown', function() {
    $audio[0].pause();
  });
};
