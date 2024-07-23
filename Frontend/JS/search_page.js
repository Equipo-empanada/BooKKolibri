/*
Script for the search page
*/

//Variables del DOM
var results_container;

//Funciones
function putResults(results){
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
                            <p class="card-text"><strong>Disponible!</strong> </p>
                            <button class="btn btn-cart" onclick="getProductionInfo(${result.id_publication})">
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

function getAll(mode){
    var url = "http://localhost:5000/galery/"+mode;
    return fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            //"Authorization": "Bearer " + localStorage.getItem("token")
        }
    }).then(response => {
        if (response.ok){
            console.log("Libros obtenidas");
            return response.json();
        }else {
            throw new Error("Error al obtener las ventas");
        }
    });
}

function getSearchResults(search){
    var url = "http://localhost:5000/search/"+search;
    return fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            //"Authorization": "Bearer " + localStorage.getItem("token")
        }
    }).then(response => {
        if (response.ok){
            console.log("Libros obtenidas");
            return response.json();
        }else {
            throw new Error("Error al obtener las ventas");
        }
    });
}

function getProductionInfo(id){
    //Redirect to the production page
    window.location.href = "item_sell_page?id="+id;
}

//Inicializacion
function init(){
    //Get mode in url
    var url = new URL(window.location.href);
    var mode = url.searchParams.get("mode");
    var category = url.searchParams.get("category");
    var search = url.searchParams.get("search");
    profilePic = document.getElementById("profile_pic");
    results_container = document.getElementById("results_container");
    // putUserPic();

    if (mode === "search"){
        getSearchResults(search).then(results => {
            console.log(results);
            putResults(results);
        }).catch(error => {
            console.log(error);
        });
        //Caso ventas
    }else if (mode === "view_category" && category == 'venta'){
        console.log("entro a ventas");
        getAll('venta').then(results => {
            console.log(results);
            putResults(results);
        }).catch(error => {
            console.log(error);
        });
    }else {
        //Intercambio
        getAll(category).then(results => {
            console.log(results);
            putResults(results);
        }).catch(error => {
            console.log(error);
        });
    }
}

document.addEventListener("DOMContentLoaded", init);
