var express = require("express");
var router = express.Router({mergeParams: true});
var Beach = require("../models/beaches");
var Comment = require("../models/comment");
var middleware = require("../middleware");


router.get("/new", middleware.isLoggedIn, function(req, res) {
   Beach.findById(req.params.id, function(err, beach){
       if(err) {
            console.log(err);     
       } else {
           res.render("comments/new", {beach: beach});
       }
   });
});

router.post("/", middleware.isLoggedIn, function(req, res){
   Beach.findById(req.params.id, function(err, beach){
       if(err){
           console.log("ERROR 1");
           res.redirect("/beaches");
       } else {
           Comment.create(req.body.comment, function(err, comment){
               if(err){
                   console.log("ERROR 2!!!");
               } else {
                   comment.author.id = req.user._id;
                   comment.author.username = req.user.username;
                   comment.save();
                   beach.comments.push(comment);
                   beach.save();
                   res.redirect("/beaches/" + beach._id);
               }
           });
       }
  }); 
});

//EDIT
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Beach.findById("req.params.id", function(err, foundBeach){
        if(err || !foundBeach){
            req.flash("error", "No Beach Found");
            return res.redirect("back");
        }
         Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err) {
                res.redirect("back");
            } else {
                res.render("comments/edit", {beach_id: req.params.id, comment: foundComment});
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
          res.redirect("/beaches/" + req.params.id);
      }
  }); 
});

//DESTROY
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, req.body.comment, function(err){
        if(err){
            res.redirect("/beaches");
        } else {
            req.flash("Success", "You Deleted Your Comment")
            res.redirect("/beaches");
        }
    });
});




module.exports = router;