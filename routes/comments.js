
var Comment = require("../models/comment");
var Recipe = require("../models/recipe");
var express = require("express");
var router = express.Router();
var middleware = require("../middleware/index.js");
// <---------------- COMMENTS ROUTES ------------->

//NEW route
router.get("/recipes/:id/comments/new", middleware.isLoggedIn, function(req, res){
    var recipeId = req.params.id;   //insert recipe _id into comments/new.ejs file so the form can trigger the
    res.render("comments/new", {id: recipeId});  //CREATE route with the proper _id
});
//CREATE route
router.post("/recipes/:id/comments/new", middleware.isLoggedIn, function(req, res){
    Recipe.findById(req.params.id, function(err, foundRecipe){ //finds the correct recipe via id
        if(err){
            console.log(err);
        } else {
            var author = req.body.author; //build the new comment variable
            var text = req.body.text;
            var newData = {author: author, text: text};
            var author = {
                id: req.user._id,
                username: req.user.username
            }
            
            Comment.create(newData, function(err, createdComment){ //create the new comment
                if(err){
                    console.log(err);
                } else {
                    createdComment.author = author;
                    createdComment.save(); //save the comment and push it into the recipe
                    foundRecipe.comments.push(createdComment);
                    foundRecipe.save(); //final save and then redirect
                    // console.log(foundRecipe);

                    res.redirect("/recipes/" + req.params.id);
                }
                
            });
        }
    });
});

//EDIT route
router.get("/recipes/:id/comment/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){ //comment ownership authent
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            console.log(err);
            res.redirect("/recipes/"+req.params.id);
        } else {
            res.render("comments/edit", {campgroundId :req.params.id, comment: foundComment});
        }
    });
});

//UPDATE route
router.put("/recipes/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){ //comment ownership
    Recipe.findById(req.params.id, function(err, foundRecipe){
        if(err){
            console.log(err);
        } else {
            var text = req.body.text;
            var newData = {text: text};
            Comment.findByIdAndUpdate(req.params.comment_id, newData,function(err, updatedComment){
                if(err){
                    console.log(err);
                } else {
                    updatedComment.save();
                    res.redirect("/recipes/"+ req.params.id);
                }
            });
        }
    });
});

//DESTROY route
router.delete("/recipes/:id/comment/:comment_id", middleware.checkCommentOwnership, function(req, res){ //comment ownership
    Comment.findByIdAndDelete(req.params.comment_id, function(err){
        if(err){
            console.log(err);
        } else {
            res.redirect("/recipes/"+req.params.id);
        }
    });
});

module.exports = router;
