var express = require("express");
var router = express.Router({mergeParams: true});
var Beach = require("../models/beaches");
var middleware = require("../middleware");

router.get("/beaches", function(req, res){
    Beach.find({}, function(err, allBeaches){
        if(err){
            console.log(err);
        } else{
            res.render("beaches/index", {beaches: allBeaches});
        }
    });
});

router.post("/beaches", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newBeach = {name: name, image: image, description: description, author: author};
    Beach.create(newBeach, function(err, newlycreated){
        if(err){
            console.log(err);
        } else {
            res.redirect("/beaches");
        }
    });
});

router.get("/beaches/new", middleware.isLoggedIn, function(req, res) {
    res.render("beaches/new");
});


router.get("/beaches/:id", function(req, res) {
    Beach.findById(req.params.id).populate("comments").exec(function(err, foundBeach){
       if(err || !foundBeach) {
            req.flash("error", "Beach not found");
            res.redirect("back");
       } else {
           res.render("beaches/show", {beach: foundBeach});
       }
    });
});

//EDIT
router.get("/beaches/:id/edit", middleware.checkBeachOwnership, function(req, res) {
         Beach.findById(req.params.id, function(err, foundBeach){
                res.render("beaches/edit", {beach: foundBeach});
           });
});

//UPDATE
router.put("/beaches/:id", middleware.checkBeachOwnership, function(req, res){
   Beach.findByIdAndUpdate(req.params.id, req.body.beach, function(err, updated){
       if(err){
           req.flash("error", "Beach not found");
           res.redirect("/beaches");
       } else { 
           res.redirect("/beaches/" + req.params.id);
       }
   }); 
});

//DESTROY
router.delete("/beaches/:id", middleware.checkBeachOwnership, function(req, res){
    Beach.findByIdAndRemove(req.params.id, function(err){
        if(err){
            req.flash("error", "Beach not found");
            res.redirect("/beaches");
        } else {
             req.flash("Success", "You Deleted Your Beach")
            res.redirect("/beaches");
        }
    });
});



module.exports = router;