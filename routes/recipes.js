var Recipe = require("../models/recipe");
var express = require("express");
var router = express.Router();
var middleware = require("../middleware/index.js")

// <------------ RECIPES ROUTES ------------>
//index page
router.get("/", function(req, res){
    res.render("landing");
});

//INDEX route
router.get("/recipes", function(req, res){ //every time recipes.ejs file loads, render the data from the database and create the recipe gui
    Recipe.find({}, function(err, allRecipes){ // {} finds every element in the collection and stores them in allRecipes variable
        if(err){
            console.log(err)
        } else {
            res.render("recipes/recipes", {recipes : allRecipes}) //renders recipes.ejs and inserts allRecipes as 'recipes'
        }
    });
});

//NEW route
router.get("/recipes/new", middleware.isLoggedIn, function(req, res){
    res.render("recipes/new");
});
//CREATE route
router.post("/recipes/new", middleware.isLoggedIn, function(req, res){ //gets req.body data from the form in new.ejs
    var newRecipe = {name: req.body.name,
                    image: req.body.image, 
                    description: req.body.description, 
                    cookingTime: req.body.cookingTime, 
                    ingredients: req.body.ingredients,
                    steps: req.body.steps}; //builds variable with new data

    var author = { //get the currently logged in user data and add it to Recipe object
        id :req.user._id,
        username :req.user.username
    };
    Recipe.create(newRecipe, function(err, newRecipe){ //creates new element in database with given data
        if(err){
            console.log(err)
        } else {
            newRecipe.author = author;
            newRecipe.save();
            console.log(newRecipe);
            res.redirect("/recipes"); //redirects back to /recipes, where it runs the code again and rebuilds content
        }
    });
});

//SHOW route
router.get("/recipes/:id", function(req, res){ //gets the recipe _id via URL, finds the recipe from db by _id, renders show.ejs file
    Recipe.findById(req.params.id).populate("comments").exec(function(err, foundRecipe){ //inserts found recipe to the callback function
        if(err){
            console.log(err);
        } else {
            res.render("recipes/show", {recipe: foundRecipe}); //insert foundRecipe to show.ejs file under the variable recipe
        }
    });
});

//EDIT route
router.get("/recipes/:id/edit", middleware.checkRecipeOwnership, function(req, res){ //add recipe ownership authent middleware
    Recipe.findById(req.params.id, function(err, foundRecipe){
        if(err){
            console.log(err);
        } else {
            res.render("recipes/edit", {recipe: foundRecipe});
        }
    });
});

//UPDATE route
router.put("/recipes/:id", middleware.checkRecipeOwnership, function(req, res){ //recipe authent
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var updatedData = {name: name, image: image, description: desc};
    Recipe.findByIdAndUpdate(req.params.id, updatedData, function(err, updatedRecipe){
        if(err){
            console.log(err);
        } else {
            res.redirect("/recipes");
        }
    });
});

//DESTROY route
router.delete("/recipes/:id", middleware.checkRecipeOwnership, function(req, res){ //recipe ownership authent
    Recipe.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
        } else {
            res.redirect("/recipes");
        }
    });
});

module.exports = router;
