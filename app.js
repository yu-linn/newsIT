const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;
const User = require('./public/js/user')
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync();


app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.use(cookieParser());
session.nCookieExpirationDelay = 48;
session.bLocationLogin = true; //keep this for testing purposes only- shows username in url

app.use(session({
   key: 'user_sessionid',	
  secret: 'this is a secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
        expires: 600000
    }
}));

app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sessionid');        
    }
    next();
});

var checkSession = (req, res, next) => {
    if (req.session.user && req.cookies.user_sessionid) {
        res.redirect('/');
    } else {
        next();
    }    
};

//render login if logged in, else show index page
app.get('/',  function (req, res) {
	if (req.session.userInfo && req.cookies.user_sessionid) {	
	  res.render('login', {
      savedTopics: req.session.userInfo.savedTopics, 
			fullname:req.session.userInfo.fullname, 
			email: req.session.userInfo.email, 
			username: req.session.userInfo.username,
			password:  req.session.userInfo.password
    });
	}
	else {
		res.render('index', {savedTopics: [], fullname: "", email: "", username: "", password: ""});
	}
});
//add topics to saved topic list
app.put('/users/:user/topics/:topic', function (req, res) {
  if (req.session.userInfo.username && req.session.userInfo.username == req.params.user) {
    User.findOne({ username: req.session.userInfo.username }, (err, aUser) => {
      if (err) {
        return res.sendStatus(404);
      }
      if (aUser != null) {
        if(aUser.savedTopics.length == aUser.savedTopics.filter(function(topic) { return topic != req.params.topic }).length) {
          aUser.savedTopics.push(req.params.topic);
          aUser.save((err1) => {
            if (err1) {
              res.sendStatus(404);
            } else {
              req.session.userInfo.savedTopics = aUser.savedTopics;
              res.sendStatus(200);
            }
          });
        } else {
          res.sendStatus(400);
        }
      } else {
        res.sendStatus(404);
      }
    });
  } else {
    res.sendStatus(401);
  }
});
//deletes topic from saved topics list
app.delete('/users/:user/topics/:topic', function (req, res) {
  if (req.session.userInfo.username && req.session.userInfo.username == req.params.user) {
    User.findOne({ username: req.session.userInfo.username }, (err, aUser) => {
      if (err) {
        return res.sendStatus(404);
      }
      if (aUser != null) {
        aUser.savedTopics = aUser.savedTopics.filter(function(topic) { return topic != req.params.topic });
        aUser.save((err1) => {
          if (err1) {
            res.sendStatus(404);
          } else {
            res.sendStatus(202);
          }
        });
      } else {
        res.sendStatus(404);
      }
    });
  } else {
    res.sendStatus(401);
  }
});
//check if username is taken
app.get('/usernamecheck', function(req,res){
  User.findOne({username: req.query.username}, function(err,user){
    if(err){
      console.log(err);
    }
    var msg;
    if(user != null){
      msg = "exist"
    }
    else{
      msg = "not exist"
    }
    res.json({message: msg})
  })
})
//check if login credentials are valid
app.get('/validLogin', function(req,res){
  User.findOne({username:req.query.username}, function(err,user){
    var msg;
    if (err) {
        return res.redirect('/login');
      } else {
        if (user != null) {
          msg = "hi there"
          if(bcrypt.compareSync(req.query.password, user.password)){
            req.session.userInfo = user; //unique session identifier 
            msg = "success"
          }
          else{
            msg = "password_wrong"
          }
          
        } else {
          msg = "username_wrong"
        }
        res.json({message: msg})
      }
  })
})
//signup user and save to database
app.post('/signup', function (req, res) {
  if (req.body.fullname &&
      req.body.email &&
      req.body.username &&
      req.body.password) {
    var topics = new Array();
    var hash = bcrypt.hashSync(req.body.password, salt);
      var userData = {
        fullname: req.body.fullname,
        email: req.body.email,
        username: req.body.username,
        password: hash,
        savedTopics: []
      }
  }
    //use schema.create to insert data into the db
    User.create(userData, function (err, user) {
      if (err) {
        return res.redirect('/');
      } else {
        return res.redirect('/');
      }
    });
});
//check if username and password is correct
app.post('/login', function (req, res) {
  if (req.body.username && req.body.password) {  	
    User.findOne({ username: req.body.username}, (err, aUser) => {
      if (err) {
        return res.redirect('/login');
      } else {
        if (aUser != null) {
          if(bcrypt.compareSync(req.body.password, aUser.password)){
          	req.session.userInfo = aUser; //unique session identifier 
          	res.render('login', aUser);
          }
          else{
          	return false;
          }
        } else {
          return false;
        } 
      }
    });
  } else {
    return res.redirect('/');
  }
});

//logout of page and clear session 	
app.get('/logout', function (req, res) {
   if (req.session.userInfo && req.cookies.user_sessionid) {
        res.clearCookie('user_sessionid');
        res.redirect('/');
    } else {
        res.redirect('/');
    }

});
 
//delete current user account from database
app.delete('/users/:user', function(req, res) {
  if (req.session.userInfo && req.session.userInfo.username == req.params.user) {
  	User.findOneAndRemove({ username: req.session.userInfo.username }, function(err, docs) {
  		if(err) {
  			 res.json(err);
  		}
  		else {
  			if (req.session.userInfo && req.cookies.user_sessionid) {
          res.clearCookie('user_sessionid');
        }	
        res.sendStatus(202);
  		  // res.render('index', {savedTopics: [], fullname: "", email: "", username: "", password: ""});
      }
    });
  } else {
    res.sendStatus(401);
  }
});