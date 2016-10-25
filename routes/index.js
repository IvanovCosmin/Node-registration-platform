var express = require('express');
var passport = require('passport');
var router = express.Router();
var User =   require("./../models/user");
var Act = require('./../models/act');
var mongoose = require('mongoose');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.render('login.ejs', { message: req.flash('loginMessage') });
});

router.get('/signup', function(req, res) {
  res.render('signup.ejs', { message: req.flash('loginMessage') });
});

router.get('/profile', isLoggedIn, function(req, res) {
  var item0 = [];
  var item1 = [];
  var item2 = [];
  var item3 = [];
  var item4 = [];
  var ex = [];
  
  Act.find({} , function(err , docs){
      if (err) { throw err;}
      else {
      docs.forEach(function(item) {
          switch(item.ziua){
              case '0':
                item0.push(item);
                break;
              case '1':
                item1.push(item);
                break;
              case '2':
                item2.push(item);
                break;
              case '3':
                item3.push(item);
                break;
              case '4':
                item4.push(item);
                break;
              case 'ex':
                ex.push(item);
                break;


          }

      })
      res.render('profile.ejs', { user: req.user , item0: item0 , item1: item1 , item2: item2 , item3: item3 , item4:item4 , ex: ex} );
      }
  })
});

router.post('/profile', isLoggedIn, function(req, res) {
  var change = req.body;
  var heh1 = String(req.user.activities).split('');
  var heh = String(req.body.activities).split('');

var arr1 = heh1.filter( function( el ) {
  return heh.indexOf( el ) < 0;
});

console.log(arr1);

var arr2 = heh.filter( function( el ) {
  return heh1.indexOf( el ) < 0;
});

  arr2.forEach(function(item){
     Act.update({id: item}, {$push: {legume: String(req.user._id)}}, {upsert:true}, function(err){
       if(err){
                console.log(err);
       }else{
                console.log("Successfully added");
        }
 })})
 arr1.forEach(function(item){
     Act.update({id: item}, {$pull: {legume: String(req.user._id)}}, {upsert:true}, function(err){
       if(err){
                console.log(err);
       }else{
                console.log("Successfully added");
        }
  })}) 
  var query = {_id: req.user._id};
  User.update(query,change,function(err){
    if(err) {console.log(err);}
    console.log("updated");
  })
  res.redirect('/profile');

});

router.get('/addact' , function(req,res){
    res.render('addact.ejs');
})

router.post('/addact' , function(req,res){
    var query = req.body;
    query.nr = parseInt(query.nr);
  Act.create(query, function (err, small) {
    if (err) return handleError(err);
    console.log(query);
    res.render('addact.ejs');
})
})

router.post('/spamtati' , function(req,res){
  var x = 0;
    var query = { lol: "caca" , nume: "caca" , trestii: "caca" , id: "a" };
    for(var i = 200 ; i<= 10000 ; i++){
      query.id = String.fromCharCode(i); 
      Act.create(query, function (err, small) {
    if (err) return handleError(err);
})
       }
    res.render('index.ejs');

})


router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/profile',
  failureRedirect: '/signup',
  failureFlash: true,
}));

router.post('/login', passport.authenticate('local-login', {
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true,
}));

router.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

router.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/profile',
  failureRedirect: '/',
}));

router.get('/auth/twitter', passport.authenticate('twitter'));

router.get('/auth/twitter/callback', passport.authenticate('twitter', {
  successRedirect: '/profile',
  failureRedirect: '/',
}));

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', passport.authenticate('google', {
  successRedirect: '/profile',
  failureRedirect: '/',
}));

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
      return next();
  res.redirect('/');
}
