var Beach = require("../models/beaches");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.isLoggedIn = function (req, res, next){

    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You Need to be Logged In")
    res.redirect("/login");
};


middlewareObj.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
           Comment.findById(req.params.comment_id, function(err, foundComment){
               if(err || !foundComment){
                   req.flash("error", "Comment not found");
                   res.redirect("/beaches");
               } else {
                   if(foundComment.author.id.equals(req.user._id)){
                        next();
                   } else {
                       req.flash("error", "Permission Denied");
                       res.redirect("back");
                   }
               }
           });
 } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

middlewareObj.checkBeachOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
           Beach.findById(req.params.id, function(err, foundBeach){
               if(err || !foundBeach){
                   req.flash("error", "Beach not found");
                   res.redirect("/beaches");
               } else {
                   if(foundBeach.author.id.equals(req.user._id)){
                        next();
                   } else {
                       req.flash("error", "Permission Denied");
                       res.redirect("back");
                   }
               }
           });
 } else {
     req.flash("error", "You need to be logged in to do that")
        res.redirect("back");
    }
};


module.exports = middlewareObj;