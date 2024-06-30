/*
 JS script for the purchase page
 @Author: JJ
*/

// Global variables
var purchase_summary__button;

function purchase_click() {
    console.log("Purchase button clicked");
    location.href = "./payment_page.html";
}

function init() {
    // Initialize global variables
    purchase_summary__button = document.getElementById("purchase_summary__button").childNodes[1];
    // Add event listeners
    purchase_summary__button.addEventListener("click", purchase_click);
}

document.addEventListener("DOMContentLoaded", init);