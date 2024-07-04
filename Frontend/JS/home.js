/*
Script for the home page

*/

//Variables del DOM

var purchaseButton;
var suggestedItemsContainer;
var prom_items_container;
var change_items_container;
var profilePic;





const suggestedItems = [
    {
        image: {
            src: "../Frontend/assets/purcharseSampleHome.png",
            alt: "Producto 1"
        },
        info: {
            title: {
                main: "Luna de Pluton",
                author: "Dross"
            },
            status: "Usado"
        },
        price: "15,00 US$",
        stock: 3
    },
    {
        image: {
            src: "../Frontend/assets/image 5.png",
            alt: "Producto 2"
        },
        info: {
            title: {
                main: "JavaScript guide"
            },
            status: "NUEVO"
        },
        price: "15,00 US$",
        stock: 3
    },
    {
        image: {
            src: "../Frontend/assets/image 6.png",
            alt: "Producto 3"
        },
        info: {
            title: {
                main: "JavaScript The definitive guide"
            },
            status: "NUEVO"
        },
        price: "15,00 US$",
        stock: 3
    },
    {
        image: {
            src: "../Frontend/assets/image 7.png",
            alt: "Producto 4"
        },
        info: {
            title: {
                main: "JavaScript The guide"
            },
            status: "NUEVO"
        },
        price: "15,00 US$",
        stock: 3
    },
    {
        image: {
            src: "../Frontend/assets/image 8.png",
            alt: "Producto 5"
        },
        info: {
            title: {
                main: "JavaScript The definitive guide"
            },
            status: "NUEVO"
        },
        price: "15,00 US$",
        stock: 3
    }
];





//Funciones
//Document Ready
function purchaseItem(){
    console.log("Item Purchased");
    location.href = "./item_sell_page";

}

function fillSuggestedItems(items) {
    console.log("fillSuggestedItems")
    const container = document.getElementsByClassName("suggested_items_container")[0];

    // Adjust grid columns based on the number of items
    const columns = Math.min(items.length, 5);
    container.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    console.log(`repeat(${columns}, 1fr)`)
    // Clear existing content
    container.innerHTML = '';

    // Iterate over the items and create HTML for each
    items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('suggested_item');
        itemElement.innerHTML = `
            <div class="suggested_item__img">
                <img src="${item.image.src}" alt="${item.image.alt}">
            </div>
            <div class="suggested_item__info">
                <div class="suggested_item__info__title">
                    <span>${item.info.title.main}</span>
                    ${item.info.title.author ? `<span>${item.info.title.author}</span>` : ''}
                </div>
                <div class="suggested_item__info__status">${item.info.status}</div>
            </div>
            <div class="suggested_item__price">
                <p>${item.price}</p>
            </div>
            <p class="suggested_item__price_stock">Disponibles: ${item.stock}</p>
            <button class="suggested_items_purcharse_btn" type="button"><span><svg
                                        xmlns="http://www.w3.org/2000/svg" width="12" height="14"
                                        viewBox="0 0 12 12" class=""
                                        style="max-width: 10px; min-width: 10px; height: auto;">
                                        <path fill="#fff"
                                            d="M11.76 4.6a.79.79 0 0 0-.58-.24H7.64V.82A.79.79 0 0 0 7.4.24.79.79 0 0 0 6.82 0H5.18a.79.79 0 0 0-.58.24.79.79 0 0 0-.24.58v3.54H.82a.79.79 0 0 0-.58.24.79.79 0 0 0-.24.58v1.64c0 .23.08.42.24.58.16.16.35.24.58.24h3.54v3.54c0 .23.08.42.24.58.16.16.35.24.58.24h1.64c.23 0 .42-.08.58-.24a.79.79 0 0 0 .24-.58V7.64h3.54c.23 0 .42-.08.58-.24a.79.79 0 0 0 .24-.58V5.18a.79.79 0 0 0-.24-.58z">
                                        </path>
                                    </svg></span><span><svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                                        xmlns="http://www.w3.org/2000/svg" class=""
                                        style="max-width: 15px; min-width: 15px; height: auto;">
                                        <path
                                            d="M12 12.7499H5.386C5.1498 12.75 4.9212 12.6664 4.74067 12.5139C4.5602 12.3615 4.43953 12.1502 4.4 11.9173L2.642 1.58395C2.60233 1.35119 2.4816 1.13996 2.30113 0.987686C2.12067 0.835406 1.89213 0.7519 1.656 0.751953H1"
                                            stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                                        </path>
                                        <path
                                            d="M10.75 14.75C10.8881 14.75 11 14.6381 11 14.5C11 14.3619 10.8881 14.25 10.75 14.25"
                                            stroke="currentColor"></path>
                                        <path
                                            d="M10.75 14.75C10.6119 14.75 10.5 14.6381 10.5 14.5C10.5 14.3619 10.6119 14.25 10.75 14.25"
                                            stroke="currentColor"></path>
                                        <path
                                            d="M5.75 14.75C5.88807 14.75 6 14.6381 6 14.5C6 14.3619 5.88807 14.25 5.75 14.25"
                                            stroke="currentColor"></path>
                                        <path
                                            d="M5.75 14.75C5.61193 14.75 5.5 14.6381 5.5 14.5C5.5 14.3619 5.61193 14.25 5.75 14.25"
                                            stroke="currentColor"></path>
                                        <path
                                            d="M4.03141 9.75007H12.0787C12.5247 9.75001 12.9578 9.60094 13.3093 9.32647C13.6608 9.05207 13.9105 8.66801 14.0187 8.23541L14.9854 4.36873C15.0038 4.29499 15.0052 4.21802 14.9895 4.14366C14.9737 4.0693 14.9412 3.99952 14.8944 3.93961C14.8476 3.87971 14.7878 3.83126 14.7194 3.79795C14.6511 3.76465 14.5761 3.74736 14.5001 3.7474H3.01075"
                                            stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                                        </path>
                                    </svg></span></button>
        `;
        container.appendChild(itemElement);
    });
}


function fillPromItems(items, container) {
    console.log("fillPromItems")
    

    // Adjust grid columns based on the number of items
    const columns = Math.min(items.length, 5);
    container.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    console.log(`repeat(${columns}, 1fr)`)
    // Clear existing content
    container.innerHTML = '';

    // Iterate over the items and create HTML for each
    items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('suggested_item');
        itemElement.innerHTML = `
            <div class="suggested_item__img">
                <img src="${item.image.src}" alt="${item.image.alt}">
            </div>
            <div class="suggested_item__info">
                <div class="suggested_item__info__title">
                    <span>${item.info.title.main}</span>
                    ${item.info.title.author ? `<span>${item.info.title.author}</span>` : ''}
                </div>
                <div class="suggested_item__info__status">${item.info.status}</div>
            </div>
            <div class="suggested_item__price">
                <p>${item.price}</p>
            </div>
            <p class="suggested_item__price_stock">Disponibles: ${item.stock}</p>
            <button class="suggested_items_purcharse_btn" type="button"><span><svg
                                        xmlns="http://www.w3.org/2000/svg" width="12" height="14"
                                        viewBox="0 0 12 12" class=""
                                        style="max-width: 10px; min-width: 10px; height: auto;">
                                        <path fill="#fff"
                                            d="M11.76 4.6a.79.79 0 0 0-.58-.24H7.64V.82A.79.79 0 0 0 7.4.24.79.79 0 0 0 6.82 0H5.18a.79.79 0 0 0-.58.24.79.79 0 0 0-.24.58v3.54H.82a.79.79 0 0 0-.58.24.79.79 0 0 0-.24.58v1.64c0 .23.08.42.24.58.16.16.35.24.58.24h3.54v3.54c0 .23.08.42.24.58.16.16.35.24.58.24h1.64c.23 0 .42-.08.58-.24a.79.79 0 0 0 .24-.58V7.64h3.54c.23 0 .42-.08.58-.24a.79.79 0 0 0 .24-.58V5.18a.79.79 0 0 0-.24-.58z">
                                        </path>
                                    </svg></span><span><svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                                        xmlns="http://www.w3.org/2000/svg" class=""
                                        style="max-width: 15px; min-width: 15px; height: auto;">
                                        <path
                                            d="M12 12.7499H5.386C5.1498 12.75 4.9212 12.6664 4.74067 12.5139C4.5602 12.3615 4.43953 12.1502 4.4 11.9173L2.642 1.58395C2.60233 1.35119 2.4816 1.13996 2.30113 0.987686C2.12067 0.835406 1.89213 0.7519 1.656 0.751953H1"
                                            stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                                        </path>
                                        <path
                                            d="M10.75 14.75C10.8881 14.75 11 14.6381 11 14.5C11 14.3619 10.8881 14.25 10.75 14.25"
                                            stroke="currentColor"></path>
                                        <path
                                            d="M10.75 14.75C10.6119 14.75 10.5 14.6381 10.5 14.5C10.5 14.3619 10.6119 14.25 10.75 14.25"
                                            stroke="currentColor"></path>
                                        <path
                                            d="M5.75 14.75C5.88807 14.75 6 14.6381 6 14.5C6 14.3619 5.88807 14.25 5.75 14.25"
                                            stroke="currentColor"></path>
                                        <path
                                            d="M5.75 14.75C5.61193 14.75 5.5 14.6381 5.5 14.5C5.5 14.3619 5.61193 14.25 5.75 14.25"
                                            stroke="currentColor"></path>
                                        <path
                                            d="M4.03141 9.75007H12.0787C12.5247 9.75001 12.9578 9.60094 13.3093 9.32647C13.6608 9.05207 13.9105 8.66801 14.0187 8.23541L14.9854 4.36873C15.0038 4.29499 15.0052 4.21802 14.9895 4.14366C14.9737 4.0693 14.9412 3.99952 14.8944 3.93961C14.8476 3.87971 14.7878 3.83126 14.7194 3.79795C14.6511 3.76465 14.5761 3.74736 14.5001 3.7474H3.01075"
                                            stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                                        </path>
                                    </svg></span></button>
        `;
        container.appendChild(itemElement);
    });


}

function fillChangeItems(items, container) {
    console.log("fillChangeItems")
    
    // Adjust grid columns based on the number of items
    const columns = Math.min(items.length, 5);
    container.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    console.log(`repeat(${columns}, 1fr)`)
    // Clear existing content
    container.innerHTML = '';

    // Iterate over the items and create HTML for each
    items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('suggested_item');
        itemElement.innerHTML = `
            <div class="suggested_item__img">
                <img src="${item.image.src}" alt="${item.image.alt}">
            </div>
            <div class="suggested_item__info">
                <div class="suggested_item__info__title">
                    <span>${item.info.title.main}</span>
                    ${item.info.title.author ? `<span>${item.info.title.author}</span>` : ''}
                </div>
                <div class="suggested_item__info__status">${item.info.status}</div>
            </div>
            <div class="suggested_item__price">
                <p>${item.price}</p>
            </div>
            <p class="suggested_item__price_stock">Disponibles: ${item.stock}</p>
            <button class="suggested_items_purcharse_btn" type="button"><span><svg
                                        xmlns="http://www.w3.org/2000/svg" width="12" height="14"
                                        viewBox="0 0 12 12" class=""
                                        style="max-width: 10px; min-width: 10px; height: auto;">
                                        <path fill="#fff"
                                            d="M11.76 4.6a.79.79 0 0 0-.58-.24H7.64V.82A.79.79 0 0 0 7.4.24.79.79 0 0 0 6.82 0H5.18a.79.79 0 0 0-.58.24.79.79 0 0 0-.24.58v3.54H.82a.79.79 0 0 0-.58.24.79.79 0 0 0-.24.58v1.64c0 .23.08.42.24.58.16.16.35.24.58.24h3.54v3.54c0 .23.08.42.24.58.16.16.35.24.58.24h1.64c.23 0 .42-.08.58-.24a.79.79 0 0 0 .24-.58V7.64h3.54c.23 0 .42-.08.58-.24a.79.79 0 0 0 .24-.58V5.18a.79.79 0 0 0-.24-.58z">
                                        </path>
                                    </svg></span><span><svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                                        xmlns="http://www.w3.org/2000/svg" class=""
                                        style="max-width: 15px; min-width: 15px; height: auto;">
                                        <path
                                            d="M12 12.7499H5.386C5.1498 12.75 4.9212 12.6664 4.74067 12.5139C4.5602 12.3615 4.43953 12.1502 4.4 11.9173L2.642 1.58395C2.60233 1.35119 2.4816 1.13996 2.30113 0.987686C2.12067 0.835406 1.89213 0.7519 1.656 0.751953H1"
                                            stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                                        </path>
                                        <path
                                            d="M10.75 14.75C10.8881 14.75 11 14.6381 11 14.5C11 14.3619 10.8881 14.25 10.75 14.25"
                                            stroke="currentColor"></path>
                                        <path
                                            d="M10.75 14.75C10.6119 14.75 10.5 14.6381 10.5 14.5C10.5 14.3619 10.6119 14.25 10.75 14.25"
                                            stroke="currentColor"></path>
                                        <path
                                            d="M5.75 14.75C5.88807 14.75 6 14.6381 6 14.5C6 14.3619 5.88807 14.25 5.75 14.25"
                                            stroke="currentColor"></path>
                                        <path
                                            d="M5.75 14.75C5.61193 14.75 5.5 14.6381 5.5 14.5C5.5 14.3619 5.61193 14.25 5.75 14.25"
                                            stroke="currentColor"></path>
                                        <path
                                            d="M4.03141 9.75007H12.0787C12.5247 9.75001 12.9578 9.60094 13.3093 9.32647C13.6608 9.05207 13.9105 8.66801 14.0187 8.23541L14.9854 4.36873C15.0038 4.29499 15.0052 4.21802 14.9895 4.14366C14.9737 4.0693 14.9412 3.99952 14.8944 3.93961C14.8476 3.87971 14.7878 3.83126 14.7194 3.79795C14.6511 3.76465 14.5761 3.74736 14.5001 3.7474H3.01075"
                                            stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                                        </path>
                                    </svg></span></button>
        `;
        container.appendChild(itemElement);
    });


}



    

function init(){
    purchaseButton = document.getElementsByClassName("suggested_items_purcharse_btn");
    suggestedItemsContainer = document.getElementById("suggested_items_container");
    prom_items_container = document.getElementById("prom_items_container");
    change_items_container = document.getElementById("change_items_container");
    profilePic = document.getElementById("profile_pic");
    fillSuggestedItems(suggestedItems);
    fillPromItems(suggestedItems, prom_items_container);
    fillChangeItems(suggestedItems, change_items_container);



    for (var i = 0; i < purchaseButton.length; i++) {
        purchaseButton[i].addEventListener("click", purchaseItem);
    }
    
}

//Listeners
document.addEventListener("DOMContentLoaded", init);