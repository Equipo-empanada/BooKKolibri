/*
 JS script for the purchase page
 @Author: JJ
*/

// Global variables
var purchase_summary__button;
var shopping_cart = [];



function purchase_click() {
    console.log("Purchase button clicked");
    location.href = "./payment_page.html";
}

function getShoppingCart() {
    shopping_cart = JSON.parse(localStorage.getItem("shopping_cart"));
    console.log(shopping_cart);
    if (shopping_cart == null) {
        shopping_cart = [];
    }
    return shopping_cart;
}


function init() {
    // Initialize global variables
    purchase_summary__button = document.getElementById("purchase_summary__button").childNodes[1];
    // Add event listeners
    purchase_summary__button.addEventListener("click", purchase_click);
    



}

document.addEventListener("DOMContentLoaded", init);