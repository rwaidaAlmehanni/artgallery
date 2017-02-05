//var db = require('../config');
// var bcrypt = require('bcrypt-nodejs');
// var Promise = require('bluebird');
var mongoose=require('mongoose');

var songSchema= new mongoose.Schema({
   songname:{
   	type:String,
   	required:true,
   	unique:true
   },
  url:{
  	type:String,
  	required:true
  }

})
 var Song=mongoose.model('Song',songSchema);
module.exports = Song;
