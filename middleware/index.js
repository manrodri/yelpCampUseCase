var Campground = require("../models/campground");
var Comment = require('../models/comment');

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            var userId = req.user._id;
            var campgroundOwnerId = foundCampground.author.id
            if(campgroundOwnerId.equals(userId)){
                if(err){
                    console.log(err);
                    res.redirect('back');
                } else{
                    next();
                };
            } else{
                res.redirect('back');
            };        
        });    
    } else {
        res.redirect("back");
    };
};

middlewareObj.checkCommentOwnership = function (req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            var userId = req.user._id;
            var commentOwnerId = foundComment.author.id
            if(commentOwnerId.equals(userId)){
                if(err){
                    console.log(err);
                    res.redirect('back');
                } else{
                    next();
                };
            } else{
                res.redirect('back');
            };        
        });    
    } else {
        res.redirect("back");
    };
};


middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};


module.exports = middlewareObj;



