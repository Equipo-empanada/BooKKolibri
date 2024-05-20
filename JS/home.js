/*
Script for the home page

*/

//Variables del DOM

var purchaseButton;

//Funciones
//Document Ready
function purchaseItem(){
    console.log("Item Purchased");
    location.href = "./item_sell_page.html";

}

function init(){
    purchaseButton = document.getElementsByClassName("suggested_items_purcharse_btn");

    for (var i = 0; i < purchaseButton.length; i++) {
        purchaseButton[i].addEventListener("click", purchaseItem);
    }
    
}

//Listeners
document.addEventListener("DOMContentLoaded", init);