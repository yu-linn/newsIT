var mongoose = require('mongoose');
//var bcrypt = require('bcrypt');
//var express = require('express');
//var app = express();
//var bodyParser = require('body-parser');

//connect to MongoDB
mongoose.connect('mongodb://user1:news-it123@ds117469.mlab.com:17469/news-it');
var db = mongoose.connection;


//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
  console.log("connected!!");
});

var userSchema = new mongoose.Schema({
	fullname: {
		type: String,
		required: true,
		trim: true
	},
	email: {
		type: String,		
		required: true,
		unique: true,
		trim: true
	},
	username: {
		type: String,
		required: true,
		unique: true,
		trim: true
	},
	password: {
		type: String,
		required: true
	},
	savedTopics: [{
		type: String,
		required: false
	}]
	
});

module.exports = mongoose.model('User', userSchema);

