var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campgrounds");
var middleware = require("../middleware");

router.get("/campgrounds", function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else{
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});

router.post("/campgrounds", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, image: image, description: description, author: author};
    Campground.create(newCampground, function(err, newlycreated){
        if(err){
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});


router.get("/campgrounds/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
       if(err || !foundCampground) {
            req.flash("error", "Campgound not found");
            res.redirect("back");
       } else {
           res.render("campgrounds/show", {campground: foundCampground});
       }
    });
});

//EDIT
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
         Campground.findById(req.params.id, function(err, foundCampground){
                res.render("campgrounds/edit", {campground: foundCampground});
           });
});

//UPDATE
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
   Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updated){
       if(err){
           req.flash("error", "Campgound not found");
           res.redirect("/campgrounds");
       } else { 
           res.redirect("/campgrounds/" + req.params.id);
       }
   }); 
});

//DESTROY
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            req.flash("error", "Campgound not found");
            res.redirect("/campgrounds");
        } else {
             req.flash("Success", "You Deleted Your Campground")
            res.redirect("/campgrounds");
        }
    });
});



module.exports = router;