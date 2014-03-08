// Plugins
require('../../components/FitText.js/jquery.fittext.js');

// Modules
var suggest = require('../../custom/js/lib/suggest.js');
var inputFit = require('../../custom/js/lib/inputFit.js');

// Cached variables
var $question = $('#question');
var $topic = $question.find('input');

$(document).ready(function() {
  // Embiggen the question text
  $question.fitText();

  // Focus the input so it's obvious the UI expects you to type
  $topic.focus();

  // Initialize suggestions on home page
  suggest.init($topic);

  // Initialize input fitting for long suggestions on home page
  inputFit.init($question);
});
