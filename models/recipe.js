var mongoose = require("mongoose");

var recipeSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    cookingTime: Number,
    ingredients: [],
    steps: [],
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    author:{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

// var Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = mongoose.model("Recipe", recipeSchema);