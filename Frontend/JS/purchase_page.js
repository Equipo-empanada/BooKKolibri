/*
 JS script for the purchase page
 @Author: JJ
*/

// Global variables
var purchase_summary__button;
var shopping_cart = [];
var total_price = 0;
var shopping_cart__container;
var cant_prods;
var total_price__container;
var purchase_summary__total__price;
var backButton;

function purchase_click() {
    console.log("Purchase button clicked");
    location.href = "./payment_page";
}

function getShoppingCart() {
    shopping_cart = JSON.parse(localStorage.getItem("shopping_cart"));
    console.log(shopping_cart);
    if (shopping_cart == null) {
        shopping_cart = [];
    }
    return shopping_cart;
}

function setShoppingCart() {
    const shopping_cart = getShoppingCart();
    const shopping_cart__container = document.getElementById("carrito");

    // Limpiar el contenedor antes de añadir los nuevos elementos
    shopping_cart__container.innerHTML = "<h2>Mi carrito</h2>";

    // Calcular el precio total
    total_price = 0;
    // Calcular la cantidad de productos
    if (shopping_cart.length == 1) {
        cant_prods.innerHTML = "1 producto";
    } else {
        cant_prods.innerHTML = `${shopping_cart.length} productos`;
    }
    shopping_cart.forEach(item => {
        // Quitar el signo de dolar
        item.price = item.price.replace(" &nbsp;US$", "");
        total_price += parseFloat(item.price);

        // Crear el elemento del carrito
        const carritoItem = document.createElement('div');
        carritoItem.className = 'carrito__item';
        carritoItem.setAttribute('data-id', item.id);

        carritoItem.innerHTML = `
            <img src="${item.img}" alt="${item.booktitle}" class="carrito__item__img">
            <div class="carrito__item__info">
                <div class="carrito__item__info__store">
                    <img src="../Frontend/assets/logotest.png" alt="Logo">
                    <p>${item.seller}</p>
                </div>  
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none" class="svg_trash" onclick="removeItemFromCart('${item.id}')">
                <g clip-path="url(#clip0_4_198)">
                    <path d="M1.16663 3.40518H15.8333" stroke="white" stroke-opacity="0.7" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M10 0.738525H7C6.73478 0.738525 6.48043 0.843882 6.29289 1.03142C6.10536 1.21896 6 1.47331 6 1.73853V3.40519H11V1.73853C11 1.47331 10.8946 1.21896 10.7071 1.03142C10.5196 0.843882 10.2652 0.738525 10 0.738525Z" stroke="white" stroke-opacity="0.7" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M7 11.9052V6.90518" stroke="white" stroke-opacity="0.7" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M10 11.9052V6.90518" stroke="white" stroke-opacity="0.7" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M13.0733 14.4852C13.0548 14.7357 12.942 14.9699 12.7577 15.1406C12.5734 15.3113 12.3312 15.4059 12.08 15.4052H4.92C4.66878 15.4059 4.42663 15.3113 4.24231 15.1406C4.058 14.9699 3.94521 14.7357 3.92667 14.4852L3 3.40518H14L13.0733 14.4852Z" stroke="white" stroke-opacity="0.7" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </g>
                <defs>
                    <clipPath id="clip0_4_198">
                        <rect width="16" height="16" fill="white" transform="translate(0.5 0.0718689)"/>
                    </clipPath>
                </defs>
            </svg>
            <div class="carrito__item__info__product">
                <p>${item.booktitle}</p>
            </div>
            <div class="carrito__item__book_status">
                <p>Estado: ${item.state}</p>
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 15 15" fill="none" class="svg_question_mark">
                    <g clip-path="url(#clip0_4_213)">
                      <path d="M5.96875 5.82816C5.96881 5.50734 6.05706 5.19271 6.22385 4.91866C6.39065 4.64461 6.62955 4.42169 6.91451 4.27424C7.19941 4.12681 7.51942 4.06053 7.83944 4.08266C8.15952 4.10479 8.46734 4.21447 8.72926 4.39972C8.99117 4.58497 9.19715 4.83865 9.32461 5.13305C9.45212 5.42745 9.49623 5.75123 9.45213 6.069C9.40803 6.38677 9.27747 6.68633 9.07465 6.93489C8.87182 7.18345 8.60454 7.37146 8.30208 7.47838C8.1314 7.53876 7.98364 7.65053 7.87917 7.79834C7.77469 7.94622 7.71863 8.12279 7.71875 8.3038V8.89063" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M7.71875 11.0781C7.59794 11.0781 7.5 10.9802 7.5 10.8594C7.5 10.7386 7.59794 10.6406 7.71875 10.6406" stroke="white" stroke-width="1.5"/>
                      <path d="M7.71875 11.0781C7.83956 11.0781 7.9375 10.9802 7.9375 10.8594C7.9375 10.7386 7.83956 10.6406 7.71875 10.6406" stroke="white" stroke-width="1.5"/>
                      <path d="M7.71875 14.1406C11.3431 14.1406 14.2812 11.2025 14.2812 7.57812C14.2812 3.95376 11.3431 1.01562 7.71875 1.01562C4.09438 1.01562 1.15625 3.95376 1.15625 7.57812C1.15625 11.2025 4.09438 14.1406 7.71875 14.1406Z" stroke="white" stroke-width="1.5" stroke-miterlimit="10"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_4_213">
                        <rect width="14" height="14" fill="white" transform="translate(0.71875 0.578125)"/>
                      </clipPath>
                    </defs>
                </svg>
            </div>
            <div class="carrito__item__price">
                <p>${item.price} US$</p>
            </div>
        `;

        shopping_cart__container.appendChild(carritoItem);
    });
    // Mostrar el precio total
    total_price__container.innerHTML = `${total_price} US$`;
    purchase_summary__total__price.innerHTML = `<span>${total_price} US$</span>`;
}

function removeItemFromCart(bookId) {
    // Obtener el carrito del local storage
    let shopping_cart = JSON.parse(localStorage.getItem("shopping_cart"));
    if (shopping_cart == null) {
        shopping_cart = [];
    }

    // Filtrar el carrito para eliminar el elemento con el id correspondiente
    shopping_cart = shopping_cart.filter(item => item.id !== bookId);

    // Guardar el carrito actualizado en el local storage
    localStorage.setItem("shopping_cart", JSON.stringify(shopping_cart));

    // Actualizar la visualización del carrito
    setShoppingCart();
}

// Items sugueridos

async function loadRecommendedItems() {
    const response = await fetch('http://localhost:5000/galery/Venta?limit=5');
    const recommendedItems = await response.json();
    
    const suggestedItemsContainer = document.querySelector('.suggested_items_container');
    suggestedItemsContainer.innerHTML = ''; // Limpiar contenido previo

    recommendedItems.forEach(item => {
        const suggestedItem = document.createElement('div');
        suggestedItem.className = 'suggested_item_top';
        
        suggestedItem.innerHTML = `
            <div class="suggested_item">
                <div class="suggested_item__img">
                    <img src="${item.image.src}" alt="${item.image.alt}">
                </div>
                <div class="suggested_item__info">
                    <div class="suggested_item__info__title">
                        <span>${item.info.title.main} </span>
                    </div>
                    <div class="suggested_item__info__status">NUEVO</div>
                </div>
                <div class="suggested_item__price">
                    <p>${item.price}</p>
                    <button class="suggested_items_purcharse_btn" type="button" onclick="redirectToItemSellPage(${item.id_publication})">
                        <span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="14" viewBox="0 0 12 12" class="" style="max-width: 10px; min-width: 10px; height: auto;">
                                <path fill="#fff" d="M11.76 4.6a.79.79 0 0 0-.58-.24H7.64V.82A.79.79 0 0 0 7.4.24.79.79 0 0 0 6.82 0H5.18a.79.79 0 0 0-.58.24.79.79 0 0 0-.24.58v3.54H.82a.79.79 0 0 0-.58.24.79.79 0 0 0-.24.58v1.64c0 .23.08.42.24.58.16.16.35.24.58.24h3.54v3.54c0 .23.08.42.24.58.16.16.35.24.58.24h1.64c.23 0 .42-.08.58-.24a.79.79 0 0 0 .24-.58V7.64h3.54c.23 0 .42-.08.58-.24a.79.79 0 0 0 .24-.58V5.18a.79.79 0 0 0-.24-.58z"></path>
                            </svg>
                        </span>
                        <span>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="" style="max-width: 15px; min-width: 15px; height: auto;">
                                <path d="M12 12.7499H5.386C5.1498 12.75 4.9212 12.6664 4.74067 12.5139C4.5602 12.3615 4.43953 12.1502 4.4 11.9173L2.642 1.58395C2.60233 1.35119 2.4816 1.13996 2.30113 0.987686C2.12067 0.835406 1.89213 0.7519 1.656 0.751953H1" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>
                                <path d="M10.75 14.75C10.8881 14.75 11 14.6381 11 14.5C11 14.3619 10.8881 14.25 10.75 14.25" stroke="currentColor"></path>
                                <path d="M10.75 14.75C10.6119 14.75 10.5 14.6381 10.5 14.5C10.5 14.3619 10.6119 14.25 10.75 14.25" stroke="currentColor"></path>
                                <path d="M5.75 14.75C5.88807 14.75 6 14.6381 6 14.5C6 14.3619 5.88807 14.25 5.75 14.25" stroke="currentColor"></path>
                                <path d="M5.75 14.75C5.61193 14.75 5.5 14.6381 5.5 14.5C5.5 14.3619 5.61193 14.25 5.75 14.25" stroke="currentColor"></path>
                                <path d="M4.03141 9.75007H12.0787C12.5247 9.75001 12.9578 9.60094 13.3093 9.32647C13.6608 9.05207 13.9105 8.66801 14.0187 8.23541L14.9854 4.36873C15.0038 4.29499 15.0052 4.21802 14.9895 4.14366C14.9737 4.0693 14.9412 3.99952 14.8944 3.93961C14.8476 3.87971 14.7878 3.83126 14.7194 3.79795C14.6511 3.76465 14.5761 3.74736 14.5001 3.7474H3.01075" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg>
                        </span>
                    </button>
                </div>
                <p class="suggested_item__price_stock">Disponible! ${item.info.status === '1' ? 'Nuevo' : 'Usado'}</p>
            </div>
        `;

        suggestedItemsContainer.appendChild(suggestedItem);
    });

    // Ajustar el estilo de las columnas dependiendo del número de publicaciones
    suggestedItemsContainer.style.gridTemplateColumns = `repeat(${recommendedItems.length}, 1fr)`;
}

function redirectToItemSellPage(id) {
    location.href = "/item_sell_page?id=" + id;
}


function init() {
    // Initialize global variables
    backButton = document.getElementById("backButton");
    shopping_cart__container = document.getElementById("carrito");
    total_price__container = document.getElementById("total_price__container");
    cant_prods = document.getElementById("cant_prods");
    purchase_summary__total__price = document.getElementById("purchase_summary__total__price");
    // Get shopping cart
    setShoppingCart();

    // Add event listeners
    backButton.addEventListener("click", () => {
       // Go back to the previous page
         window.history.back();
        
    });

    purchase_summary__button = document.getElementById("purchase_summary__button").childNodes[1];
    // Add event listeners
    purchase_summary__button.addEventListener("click", purchase_click);
}

document.addEventListener("DOMContentLoaded", init);
document.addEventListener("DOMContentLoaded", loadRecommendedItems);
