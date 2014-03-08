require('../../../components/typeahead.js/dist/typeahead.bundle.js');

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

exports.init = function($topic) {

  // initialize the bloodhound suggestion engine
  topics.initialize();

  // instantiate the typeahead UI
  $topic.typeahead(null, {
    displayKey: 'topic',
    source: topics.ttAdapter()
  });
};
