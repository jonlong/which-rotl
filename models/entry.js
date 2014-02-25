 var mongoose = require('mongoose');
 var Schema = mongoose.Schema;

 module.exports = mongoose.model('Entry', new Schema({
   topic: String,
   episode_number: Number,
   time_start: Number,
   time_stop: Number,
   author_name: String,
   author_link: String,
   post_date: {
     type: Date,
     default: Date.now
   }
 }));
