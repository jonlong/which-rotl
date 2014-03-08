require('../../../components/inputFit/jquery.inputfit.js');

var getQuestionSize = function($question) {
  return $question.css('font-size');
};

var init = function($question) {
  $('input').inputfit({
    minSize: false,
    maxSize: getQuestionSize($question)
  });
};

exports.init = function($question) {
  init($question);
  $(window).on('resize.fittext orientationchange.fittext', init);
};
