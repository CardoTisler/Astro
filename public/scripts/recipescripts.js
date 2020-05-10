var i = 2;
// $("#add-ingredient-btn").onclick = 

function addIngredientSlot(){
    var container = $("#ingredients-container");
    var template = `
        <label>Ingredient ${i}</label><br>
        <input type="text" class="form-control" name ="ingredients">`;
    div = document.createElement("div");
    div.innerHTML = template;
    container.append(div);
    i++;
}

// var j = 2;
// function addStepsSlot(){
//     var container = $("#steps-container");

//     var template = `
//         <label>Step ${j}:</label><br>
//         <input type="text" name ="steps">`;
//     div = document.createElement("div");
//     div.innerHTML = template;
//     container.append(div);
    
//     j++;
// }