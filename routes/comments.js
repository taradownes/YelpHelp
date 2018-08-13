var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campgrounds");
var Comment = require("../models/comment");
var middleware = require("../middleware");


router.get("/new", middleware.isLoggedIn, function(req, res) {
   Campground.findById(req.params.id, function(err, campground){
       if(err) {
            console.log(err);     
       } else {
           res.render("comments/new", {campground: campground});
       }
   });
});

router.post("/", middleware.isLoggedIn, function(req, res){
   Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log("ERROR 1");
           res.redirect("/campgrounds");
       } else {
           Comment.create(req.body.comment, function(err, comment){
               if(err){
                   console.log("ERROR 2!!!");
               } else {
                   comment.author.id = req.user._id;
                   comment.author.username = req.user.username;
                   comment.save();
                   campground.comments.push(comment);
                   campground.save();
                   res.redirect("/campgrounds/" + campground._id);
               }
           });
       }
  }); 
});

//EDIT
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Campground.findById("req.params.id", function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "No Campground Found");
            return res.redirect("back");
        }
         Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err) {
                res.redirect("back");
            } else {
                res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
            }
        });
    });
   
});


// UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
      if(err){
          res.redirect("back");
      } else { 
          res.redirect("/campgrounds/" + req.params.id);
      }
  }); 
});

//DESTROY
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, req.body.comment, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
            req.flash("Success", "You Deleted Your Comment")
            res.redirect("/campgrounds");
        }
    });
});




module.exports = router;