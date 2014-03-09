// Modules
var audio = require('../../custom/js/lib/audio.js');

// Cached variables
var $clip = $('.clip');

$(document).ready(function() {

  $clip.each(function() {
    audio.init($(this));
  });
});
