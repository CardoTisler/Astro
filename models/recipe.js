var mongoose = require("mongoose");

var recipeSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
        }
    ]
});

// var Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = mongoose.model("Recipe", recipeSchema);