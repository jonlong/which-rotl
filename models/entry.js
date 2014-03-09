var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EntrySchema = new Schema({
  topic_display: String,
  topic_slug: String,
  episode_number: Number,
  time_start: Number,
  time_stop: Number,
  author_name: String,
  author_link: String,
  post_date: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Entry', EntrySchema);
