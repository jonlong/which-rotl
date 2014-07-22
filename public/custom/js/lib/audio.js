// Modules
require('../../../components/bootstrap/js/tooltip.js');
var countdown = require('./countdown.js');
var Mustache = require('../../../components/mustache/mustache.js');


var Template = {
  load: function(time, callback) {
    $.get('/custom/js/templates/audio.mst', function(template) {
      var rendered = Mustache.render(template, {time: time});

      callback(rendered);
    });
  },
  init: function($template, $audio, times) {
    var $playBtn = $template.find('.play');
    var $playBtnIcon = $playBtn.find('.glyphicon');
    var $timeBtn = $template.find('.countdown');
    var $muteBtn = $template.find('.mute');
    var $muteBtnIcon = $muteBtn.find('.glyphicon');
    var $volumeSlider = $template.find('.volume input');
    var $countdown = $template.find('.countdown');
    var player = $audio[0];
    var self = this;

    var checkVolume = function() {
      if (player.volume > 0.5 && !player.muted) {
        $muteBtnIcon
          .removeClass('glyphicon-volume-down glyphicon-volume-off')
          .addClass('glyphicon-volume-up');
      } else if (player.volume < 0.5 && player.volume > 0 && !player.muted) {
        $muteBtnIcon
          .removeClass('glyphicon-volume-up glyphicon-volume-off')
          .addClass('glyphicon-volume-down');
      } else {
        $muteBtnIcon
          .removeClass('glyphicon-volume-down glyphicon-volume-up')
          .addClass('glyphicon-volume-off');
      }
    };

    // Initialize the time counter
    countdown.init($countdown, times.duration * 1000);

    // Handle Play Button
    $playBtn.on('click', function() {
      if (player.paused === false) {
        $playBtnIcon
          .removeClass('glyphicon-pause')
          .addClass('glyphicon-play');

        player.pause();
      } else {
        $playBtnIcon
          .removeClass('glyphicon-play')
          .addClass('glyphicon-pause');

        player.play();
      }
    });

    // Handle Time Button
    // When clicked, reset the playhead
    $timeBtn.click(function () {
      player.pause();
      player.currentTime = times.start;
      self.reset($template);
    });

    // Show a tooltip on hover
    $timeBtn.tooltip({'container': 'body', 'placement': 'right', 'html': true});

    // Handle Volume Control
    $muteBtn.on('click', function() {
      if (player.muted) {
        player.muted = false;
        player.volume = player.oldvolume;
      } else {
        player.muted = true;
        player.oldvolume = player.volume;
        player.volume = 0;
      }
      checkVolume();
    });

    $volumeSlider.on('change', function() {
      player.muted = false;
      player.volume = $volumeSlider.val();
    });

    $audio.on('volumechange', function() {
      checkVolume();
      $volumeSlider.val(player.volume);
    });

    // Set the play position once the audio file is ready
    $audio.on('canplay', function() {
      $(this)[0].currentTime = times.start;
      $(this)[0].pause();
    });

    $audio.on('play', function() {
      countdown.resume($countdown);
    });

    $audio.on('pause', function() {
      countdown.pause($countdown);
    });

    // Reset the clip once the duration has elapsed
    $countdown.on('runnerFinish', function() {
      $audio[0].pause();
      $audio[0].currentTime = times.start;
      self.reset($template);
    });

  },
  reset: function($template, time) {
    var $playBtnIcon = $template.find('.play .glyphicon');
    var $countdown = $template.find('.countdown');

    // Reset play button state
    $playBtnIcon
      .removeClass('glyphicon-pause')
      .addClass('glyphicon-play');

    // Reset time
    $countdown.runner('reset', true);
  }
};

exports.init = function($clip) {
  var $audio = $clip.find('audio');
  var $template;

  // In seconds
  var times = {
    start: parseInt($audio.attr('data-start-time'), 10),
    end: parseInt($audio.attr('data-end-time'), 10),
  };

  times.duration = times.end - times.start;

  // Hide the audio player
  $audio.hide();

  // Load the new audio player template
  Template.load(times, function(template) {
    $template = $(template);

    Template.init($template, $audio, times);
    $audio.before($template);
  });
};
