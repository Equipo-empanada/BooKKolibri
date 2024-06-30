/*script para cargar imagenes para crear nuevo producto*/
var imgenesCarga;
var inputImg;
var spanPreview;


// Form data
var post_title;
var post_price;
var post_description;
var post_price;
var post_category;
var post_launch_year;
var post_publisher;
var post_author;
var post_state;
var post_language;
var img_srcs = [];
// Selected tags list
var tags_selected = [];
var post_location;
//Button
var btnSubmit;




function generarPreview(num_id) {
    const id_elemento = "add-photo" + num_id;
    const imagen_input = document.getElementById(id_elemento);

    imagen_input.addEventListener('change', function() {
        const archivo = imagen_input.files[0];
        var tipoImagen = ["image/jpeg", "image/png", "image/jpg"];
        
        if (archivo) {
            console.log("Archivo Válido");
            if (tipoImagen.indexOf(archivo.type) != -1) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const idIcon = "preview" + num_id;
                    const idPadre = "img" + num_id;
                    
                    const spanPadre = document.getElementById(idPadre);
                    
                    const oldImg = document.getElementById(idIcon);
                    if (oldImg) {
                        oldImg.remove();
                    }
                    
                    const img = document.createElement("img");
                    img.src = e.target.result;
                    img.id = idIcon;
                    img.style.width = "90%";
                    img.style.height = "90%";
                    img.style.maxHeight = "149px";
                    img.style.maxWidth = "167px";
                    spanPadre.appendChild(img);
                }
                reader.readAsDataURL(archivo);
                img_srcs.push(archivo);
            } else {
                alert("Imagen No válida");
            }
        } else {
            console.log("ERROR DE IMAGEN");
        }
    });

    // Dispara el clic en el input de archivo para abrir el diálogo de selección
    imagen_input.click();
}


function catchTags() {
    
    const checkboxes = document.querySelectorAll('.container-etiquetas-checkbox input[type="checkbox"]');
    
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            tags_selected.push(checkbox.id);
        }
    });
    
    console.log(tags_selected);

}

// Submit post

function submitPost(datas) {

    // //Get inner text of the location
    // var location = post_location.innerText;
    // //Get the lat and lng of the location
    // var location_lat = location.split(",")[0].split(":")[1];
    // var location_lng = location.split(",")[1].split(":")[1];
    // var post_data = {
    //     title: post_title.value,
    //     price: post_price.value,
    //     description: post_description.value,
    //     category: post_category.value,
    //     launch_year: post_launch_year.value,
    //     publisher: post_publisher.value,
    //     state: post_state.value,
    //     languge: post_language.value,
    //     tags_selected: tags_selected,
    //     location: {
    //         lat: location_lat,
    //         lng: location_lng
    //     },
    //     img_srcs: img_srcs
    // };

    // console.log("Post data:");
    // console.log(post_data);

}




// Init
function init() {

    imgenesCarga = document.getElementsByClassName("img-carga");
    inputImg = document.getElementsByClassName("input-img");
    spanPreview = document.getElementsByClassName("preview");
    post_title = document.getElementById("idTituloLibro");
    post_description = document.getElementById("idDescripLibro");
    post_price = document.getElementById("precio-input");
    post_category = document.getElementsByClassName("radio-group")[0];
    post_launch_year = document.getElementById("inputAnio");
    post_publisher = document.getElementById("inputEditorial");
    post_author = document.getElementById("inputAutores");
    post_state = document.getElementById("estado-libro");
    post_language = document.getElementById("inputIdioma");
    post_location = document.getElementById("info");
    btnSubmit = document.getElementsByClassName("publish-button")[0];


    function getSelectedRadioText(radioGroup) {
        const radios = radioGroup.querySelectorAll('input[type="radio"]');
        for (const radio of radios) {
            if (radio.checked) {
                return radio.parentElement.textContent.trim();
            }
        }
        return null;
    }

    // Event listeners
    btnSubmit.addEventListener("click", () => {

        //Latitud: -2.898702664035092, Longitud: -78.99129560295367
        const lat = post_location.textContent.split(",")[0].split(":")[1];
        const lng = post_location.textContent.split(",")[1].split(":")[1];
        catchTags();
        const postData = {
            title: post_title.value,
            description: post_description.value,
            img_srcs: img_srcs,
            price: post_price.value,
            category: getSelectedRadioText(post_category),
            launch_year: post_launch_year.value,
            publisher: post_publisher.value,
            author: post_author.value,
            state: post_state.value,
            language: post_language.value,
            location: {
                lat: lat,
                lng: lng
            },
            tags_selected: tags_selected,
        };

        console.log(postData); // For debugging purposes

        
        submitPost(postData);
    });

    

    // Convertir HTMLCollection a un array usando Array.from
    const imgenesCargaArray = Array.from(imgenesCarga);

    imgenesCargaArray.forEach(element => {
        element.addEventListener("click", (event) => {
            const clickedId = event.target.id;
            num_id = clickedId.slice(-1);
            console.log(num_id);
            generarPreview(num_id);

        });
    });



}

document.addEventListener("DOMContentLoaded", init);