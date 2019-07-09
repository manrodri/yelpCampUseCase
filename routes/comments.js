var express = require('express');
var router = express.Router({mergeParams: true});
var Campground = require('../models/campground');
var Comment = require('../models/comment');

var middlewareObj = require('../middleware');
var isLoggedIn = middlewareObj.isLoggedIn;
var checkCommentOwnership = middlewareObj.checkCommentOwnership;

router.get("/new", isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new.ejs", {campground: foundCampground, currentUser: req.user})
        }
    });
    
});

router.post("/", isLoggedIn, function(req, res){
    // look up campground using id
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
            res.redirect('/campgrounds');
        } else {
            console.log(foundCampground)
            Comment.create(req.body.comment, function(err, newComment){
                if(err){
                    console.log(err)
                } else{
                    // add usernanem and id to comment
                    //console.log('this comment was made by: ' + req.user.username);
                    newComment.author.id = req.user._id;
                    newComment.author.username = req.user.username;
                    // save comment
                    newComment.save();
                    foundCampground.comments.push(newComment);
                    foundCampground.save();
                    res.redirect('/campgrounds/' + foundCampground._id);
                }
            });
        }
    });
    
});
// GET EDIT COMMENT ROUTE
router.get("/:comment_id/edit", checkCommentOwnership, function(req, res){
    var campgroundId = req.params.id;
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("/back");
        } else {
            res.render('comments/edit', {campgroundId: campgroundId, comment:foundComment, currentUser: req.user});  
        };
    });
});
// UPDATE COMMENT ROUTE
router.put("/:comment_id", checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, comment){
        if(err){
            res.redirect('back');
        } else{
            res.redirect("/campgrounds/"+ req.params.id);
        };
    });
});
// DELETE COMMENT ROUTE
router.delete("/:comment_id", checkCommentOwnership, function(req, res){
    Comment.findByIdAndDelete(req.params.comment_id, function(err){
        if(err){
            res.redirect('back');
        } else{
            res.redirect('/campgrounds/'+ req.params.id);
        }
    });
});
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};

module.exports = router;