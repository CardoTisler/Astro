var User = require("../models/user");
var express = require("express");
var router = express.Router();
var passport = require("passport");
// <----- User authent routes ------->
router.get("/login", function(req, res){
    res.render("login"); //render the login form
});

//handle login logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/recipes",
    failureRedirect: "/login"
}), function(req, res){

});
router.get("/register", function(req, res){
    res.render("register"); //render the signup form
});

router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username}) //get new username from the register form and create new User object
    //use register() method, first param User object with username, second param password that will get hashed
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            res.redirect("/register");
        } else {
            passport.authenticate("local")(req, res, function(){
                res.redirect("/recipes");
            });
        }
    });
});

router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/recipes");
});

module.exports = router;
