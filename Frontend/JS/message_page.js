/*
JS script for message page
*/

// Global variables

var chat_header_purcharse;


// Functions
function make_purcharse() {

    window.location.href = "./payment_page.html";
}

function init() {
    chat_header_purcharse = document.getElementById("chat_header_purcharse");
    chat_header_purcharse.addEventListener("click", make_purcharse);
}

// Event listeners
document.addEventListener("DOMContentLoaded", init);