/*
*    JS Para manejar la página de venta de items
*   @autor: Juanja
*   @version: 1.0
*/
// Variables
var product_img;
var product_name;
var product_language;
var product_rating;
var product_year;
var product_publisher;
var product_sample_images;
var product_tags;
var product_state;
var product_description;
var product_price;
var seller_name;

//Botones
var message_to_seller;
var purchase_button;
var make_offer;

//Funciones
function messageToSeller() {
    location.href = "./message_page.html";
}

function makePurcharse() {
    //Obtenemos el id del post en la url
    let url = new URL(window.location.href);
    let post_id = url.searchParams.get("id");
    //Añadir al carrito
    addShoppingCart(post_id);
    location.href = "/purchase_page";
}

function addShoppingCart(post_id) {
    //Añadir al carrito (local storage)
    var shopping_cart = localStorage.getItem("shopping_cart");
    if (shopping_cart == null) {
        shopping_cart = [];
    } else {
        shopping_cart = JSON.parse(shopping_cart);
    }
    shopping_cart.push(post_id);
    localStorage.setItem("shopping_cart", JSON.stringify(shopping_cart));
    alert("Item added to shopping cart");

}


//Document Ready
function init() {

    message_to_seller = document.getElementById("message_to_seller");
    purchase_button = document.getElementById("make_purcharse");
    make_offer = document.getElementById("make_offer");
    
    //Listeners
    message_to_seller.addEventListener("click", messageToSeller);
    purchase_button.addEventListener("click", makePurcharse);
    make_offer.addEventListener("click", makePurcharse);

}

//Load
document.addEventListener("DOMContentLoaded", init);


