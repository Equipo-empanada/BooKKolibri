/*
Script for the search page

*/

//Variables del DOM

var results_container;




const results = [
    {
        image: {
            src: "./assets/purcharseSampleHome.png",
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
            src: "./assets/purcharseSampleHome.png",
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
            src: "./assets/image 5.png",
            alt: "Producto 2"
        },
        info: {
            title: {
                main: "JavaScript guide",
                author: "Dross"
            },
            status: "NUEVO"
        },
        price: "15,00 US$",
        stock: 3
    },
    {
        image: {
            src: "./assets/image 6.png",
            alt: "Producto 3"
        },
        info: {
            title: {
                main: "JavaScript The definitive guide",
                author: "Dross"
            },
            status: "NUEVO"
        },
        price: "15,00 US$",
        stock: 3
    },
    {
        image: {
            src: "./assets/image 7.png",
            alt: "Producto 4"
        },
        info: {
            title: {
                main: "JavaScript The guide",
                author: "Dross"
            },
            status: "NUEVO"
        },
        price: "15,00 US$",
        stock: 3
    },
    {
        image: {
            src: "./assets/image 8.png",
            alt: "Producto 5"
        },
        info: {
            title: {
                main: "JavaScript The definitive guide",
                author: "Dross"
            },
            status: "NUEVO"
        },
        price: "15,00 US$",
        stock: 3
    }
];



//Funciones

// function putUserPic(){
//     profilePic.innerHTML = `<img src="${userDetail.pictureSource}" alt="Profile Picture" height="50" width="50" class="profile_pic">`;
// }

function putResults(){
    results_container.innerHTML = "";
    results.forEach((result, index) => {
        results_container.innerHTML += `
        <div class="col-md-3" id="struct">
                    <div class="card mb-4">
                        <img src="${result.image.src}" class="card-img-top" alt="${result.info.title.main}" >
                        <div class="card-body">
                            <h5 class="card-title">${result.info.title.main}</h5>
                            <p class="card-text"><strong>Autor:</strong> ${result.info.title.author}</p>
                            <p class="card-text"><strong>Estado:</strong> ${result.info.status}</p>
                            <p class="card-text">${result.price}</p>
                            <p class="card-text"><strong>Disponibles:</strong> ${result.stock} </p>
                            <button class="btn btn-cart">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="14" viewBox="0 0 12 12"
                                    style="max-width: 10px; min-width: 10px; height: auto;">
                                    <path fill="#fff"
                                        d="M11.76 4.6a.79.79 0 0 0-.58-.24H7.64V.82A.79.79 0 0 0 7.4.24.79.79 0 0 0 6.82 0H5.18a.79.79 0 0 0-.58.24.79.79 0 0 0-.24.58v3.54H.82a.79.79 0 0 0-.58.24.79.79 0 0 0-.24.58v1.64c0 .23.08.42.24.58.16.16.35.24.58.24h3.54v3.54c0 .23.08.42.24.58.16.16.35.24.58.24h1.64c.23 0 .42-.08.58-.24a.79.79 0 0 0 .24-.58V7.64h3.54c.23 0 .42-.08.58-.24a.79.79 0 0 0 .24-.58V5.18a.79.79 0 0 0-.24-.58z">
                                    </path>
                                </svg>
                                Comprar
                            </button>
                        </div>
                    </div>
                </div>
        `;
    });
}

//Inicializacion
function init(){
    profilePic = document.getElementById("profile_pic");
    results_container = document.getElementById("results_container");
    // putUserPic();
    putResults();
}

document.addEventListener("DOMContentLoaded", init);
