var Recipe = require("../models/recipe");
var Comment = require("../models/comment");

var middlewareObj = {};
// <------ middleware ----->

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        next();
    } else {
        res.redirect("/login")
    }
};

middlewareObj.checkRecipeOwnership = function(req, res, next){
    Recipe.findById(req.params.id, function(err, foundRecipe){
        if(err){
            console.log(err);
            res.redirect("/recipes");
        } else {
            if(foundRecipe.author.id.equals(req.user._id)){
                next()
            } else {
                res.redirect("/recipes");
            };
        }
})};

middlewareObj.checkCommentOwnership = function(req, res, next){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            console.log(err);
            res.redirect("/recipes");
        } else {
            if(foundComment.author.id.equals(req.user._id)){
                next();
            } else {
                res.redirect("/recipes")
            };
        }
    });
};

module.exports = middlewareObj;