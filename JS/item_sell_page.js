/*
*    JS Para manejar la página de venta de items
*   @autor: Juanja
*   @version: 1.0
*/


// Sample JSON (Comes from the server)
var response = { image: "./assets/purcharseSample.png", product_name: "Luna de pluton", seller_name: "Sergio18", price: 45.23, state: "Como nuevo", description: "Librazo. Lo vendo porque he completado el libro al 100%", tags: ["Acción", "Ciencia ficción"], seller_rating: 4.5, language: "Español", year: 2015, publisher: "Planeta", sampleImages: ["./assets/samplePurcharse 1.png", "./assets/samplePurcharse 2.png", "./assets/samplePurcharse 3.png"] };

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
    location.href = "./purchase_page.html";
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


