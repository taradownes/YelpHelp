//REQUIRE APPS
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var flash = require("connect-flash");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var Beach = require("./models/beaches");
var Comment = require("./models/comment");
var seedDB = require("./seeds");
var User = require("./models/user");


// REQUIRING ROUTES
var commentsRoutes = require("./routes/comments");
var beachesRoutes = require("./routes/beaches");
var indexRoutes = require("./routes/index");


//APP CONFIG
const url = process.env.DATABASEURL || "mongodb://Tara:riley12@ds121312.mlab.com:21312/yelpcamp444";
mongoose.connect(url, { 
    useNewUrlParser: true 
})
    .then(() => console.log('mongoDB connected...'))
    .catch(err => console.log(err));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set("view engine", "ejs");
app.use(express.static(__dirname));
// app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//PASSPORT CONFIG
app.use(require("express-session")({
    secret:"Riley is the cutest dog ever!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//ROUTES

app.use(indexRoutes);
app.use(beachesRoutes);
app.use("/beaches/:id/comments", commentsRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server started");
});

// app.listen(5000, function () {
//     console.log("The Server has Started for YelpHelp")
// });