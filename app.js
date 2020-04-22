var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override")

var Recipe = require("./models/recipe.js");
var Comment = require("./models/comment.js");

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect("mongodb://localhost/recipeSite");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));



// var seedRecipe = {name: "Third", image: "Nop", description: "soon tm"}
// Recipe.create(seedRecipe, function(err, newRecipe){
//     if(err){
//         console.log(err);
//     } else {
//         Comment.create(seedComment, function(err, newComment){
//             newRecipe.comments.push(newComment);
//             console.log(newRecipe);
//             newRecipe.save();
//         });
//     };
// });

// var seedComment = {
//     author: "Peeter",
//     text: "Keedumuna Keedumuna Keedumuna Keedumuna "
// };


Recipe.findById("5e9f44969bbc3446e09f42f3").populate("comments").exec(function(err, foundRecipe){
    console.log(foundRecipe.comments[0].text);
});



// <------------ RECIPES ROUTES ------------>
//index page
app.get("/", function(req, res){
    res.render("index");
});

//INDEX route
app.get("/recipes", function(req, res){ //every time recipes.ejs file loads, render the data from the database and create the recipe gui
    Recipe.find({}, function(err, allRecipes){ // {} finds every element in the collection and stores them in allRecipes variable
        if(err){
            console.log(err)
        } else {
            res.render("recipes", {recipes : allRecipes}) //renders recipes.ejs and inserts allRecipes as 'recipes'
        }
    });
});

//NEW route
app.get("/recipes/new", function(req, res){
    res.render("new");
});
//CREATE route
app.post("/recipes/new", function(req, res){ //gets req.body data from the form in new.ejs
    var recipeName = req.body.name;
    var recipeImage = req.body.image;
    var recipeDesc = req.body.description;
    var newRecipe = {name: recipeName, image: recipeImage, description: recipeDesc}; //builds variable with new data
    
    Recipe.create(newRecipe, function(err, newRecipe){ //creates new element in database with given data
        if(err){
            console.log(err)
        } else {
            console.log(newRecipe)
            res.redirect("/recipes"); //redirects back to /recipes, where it runs the code again and rebuilds content
        }
    });
});

//SHOW route
app.get("/recipes/:id", function(req, res){ //gets the recipe _id via URL, finds the recipe from db by _id, renders show.ejs file
    Recipe.findById(req.params.id, function(err, foundRecipe){ //inserts found recipe to the callback function
        if(err){
            console.log(err);
        } else {
            res.render("show", {recipe: foundRecipe}); //insert foundRecipe to show.ejs file under the variable recipe
        }
    });
});

//EDIT route
app.get("/recipes/:id/edit", function(req, res){
    Recipe.findById(req.params.id, function(err, foundRecipe){
        if(err){
            console.log(err);
        } else {
            res.render("edit", {recipe: foundRecipe});
        }
    });
});

//UPDATE route
app.put("/recipes/:id", function(req, res){
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
app.delete("/recipes/:id", function(req, res){
    Recipe.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
        } else {
            res.redirect("/recipes");
        }
    });
});

// <---------------- COMMENTS ROUTES ------------->
















app.listen(3000, process.env.IP, function(){
    console.log("Server running.");
});