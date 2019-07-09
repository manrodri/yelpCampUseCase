var express    = require('express'),
    router     = express.Router(),
    passport   = require('passport'),
    User       = require("../models/user");


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};

// landing route
router.get("/", function(req, res){
    res.render("landing", {currentUser: req.user});
});

// auth routes
// ==========

// show register form
router.get('/register', function(req, res){
    res.render('register', {currentUser: req.user});
});
// sign up logic
router.post('/register', function(req, res){
   var newUser = User({username: req.body.username});
   User.register(newUser, req.body.password, function(err, user){
    if(err){
        console.log(err);
        return res.render('register', {currentUser: req.user});
    }
    passport.authenticate('local')(req, res, function(){
        res.redirect('/campgrounds');
    })
   });
});
//show login form
router.get("/login", function(req, res){
    res.render('login', {currentUser: req.user});
});
// login logic
router.post("/login", passport.authenticate('local',{
    successRedirect: "/campgrounds",
    failureRedirect: '/login',
}), function(req, res){

 });

// logout
router.get('/logout', function(req, res){
    req.logOut();
    res.redirect('/')
});

module.exports = router;

