var mongoose = require('mongoose');
mongoose.set('debug', true);

var Act = mongoose.Schema({
  nr: Number,
  nume: String,
  info: String,
  id: String,
  start: String,
  end: String,
  legume: {type:[String] , default:[]},
  ziua: String
});



module.exports = mongoose.model('Act', Act , 'Act');
