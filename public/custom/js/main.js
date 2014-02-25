$(function() {
  var $question = $('#question');
  var $topic = $question.find('input');

  // instantiate the bloodhound suggestion engine
  var topics = new Bloodhound({
    datumTokenizer: function(d) {
      return Bloodhound.tokenizers.whitespace(d.topic);
    },
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: [{
      topic: 'Slippers'
    }, {
      topic: 'Jack LaLanne'
    }, {
      topic: "John's home security system"
    }, {
      topic: 'Monotonix'
    }, {
      topic: 'Miley Cyrus'
    }, {
      topic: 'Supertrain'
    }, {
      topic: 'North Face Backpacks'
    }, {
      topic: "John's ant problem"
    }, {
      topic: "Where's my parade"
    }, {
      topic: 'Paul McCartney'
    }]
  });

  // initialize the bloodhound suggestion engine
  topics.initialize();

  // instantiate the typeahead UI
  $topic.typeahead(null, {
    displayKey: 'topic',
    source: topics.ttAdapter()
  });

  var getQuestionSize = function() {
    return $question.css('font-size');
  };

  var initInputFit = function() {
    var options = {
      minSize: false,
      maxSize: getQuestionSize()
    };

    $('input').inputfit(options);
  };

  $question.fitText();
  $topic.focus();
  initInputFit();

  $(window).on('resize.fittext orientationchange.fittext', initInputFit);

});

$.fn.inputfit = function(options) {
  var settings = $.extend({
    minSize: 10,
    maxSize: false
  }, options);

  this.each(function() {
    var $input = $(this);

    if (!$input.is(':input')) {
      return;
    }
    $input.off('keyup.inputfit keydown.inputfit');

    var maxSize = parseFloat(settings.maxSize || $input.css('font-size'), 10);
    var width = $input.width();
    var clone = $input.data('inputfit-clone');

    if (!clone) {
      clone = $('<div></div>', {
        css: {
          fontSize: $input.css('font-size'),
          fontFamily: $input.css('font-family'),
          position: 'absolute',
          left: '-9999px',
          visibility: 'hidden'
        }
      }).insertAfter($input);

      $input.data('inputfit-clone', clone);
    }

    $input.on('keyup.inputfit keydown.inputfit inputfit.change', function() {
      var $this = $(this);
      clone.html($this.val().replace(/ /g, '&nbsp;'));

      var ratio = width / (clone.width() || 1),
        currentFontSize = parseInt($this.css('font-size'), 10),
        fontSize = Math.floor(currentFontSize * ratio);

      if (fontSize > maxSize) {
        fontSize = maxSize;
      }
      if (fontSize < settings.minSize) {
        fontSize = settings.minSize;
      }

      $this.css('font-size', fontSize);
      clone.css('font-size', fontSize);
    });
  });

  return this;
};
