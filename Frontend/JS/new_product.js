/*script para cargar imagenes para crear nuevo producto*/
var imgenesCarga;
var inputImg;
var spanPreview;


// Form data
var post_title;
var post_price;
var post_description;
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
var radioVenta;
var radioIntercambio;


// Función para mostrar un cuadro de alerta con SweetAlert
function showAlert(message, element) {
    Swal.fire({
        title: 'Error!',
        text: message,
        icon: 'error',
        confirmButtonText: 'OK'
    }).then(() => {
        element.focus();
    });
}

// Función para mostrar una animación de carga con SweetAlert
function showLoading() {
    Swal.fire({
        title: 'Publicando...',
        text: 'Por favor espera mientras se publica el producto',
        icon: 'info',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
}

// Ocultar animación de carga
function hideLoading() {
    Swal.close();
}

// Validaciones de los campos del formulario
function validateForm() {
    if (post_title.value.trim() === "") {
        showAlert('Por favor, ingrese el título del libro.', post_title);
        return false;
    }
    if (post_description.value.trim() === "") {
        showAlert('Por favor, ingrese la descripción del libro.', post_description);
        return false;
    }
    if (post_price.value.trim() === "") {
        showAlert('Por favor, ingrese el precio del libro.', post_price);
        return false;
    }
    const category = getSelectedRadioText(post_category);
    if (!category) {
        showAlert('Por favor, seleccione una categoría.', post_category);
        return false;
    }
    if (post_launch_year.value.trim() === "") {
        showAlert('Por favor, ingrese el año de lanzamiento.', post_launch_year);
        return false;
    }
    if (post_publisher.value.trim() === "") {
        showAlert('Por favor, ingrese la editorial.', post_publisher);
        return false;
    }
    if (post_author.value.trim() === "") {
        showAlert('Por favor, ingrese el autor.', post_author);
        return false;
    }
    if (post_state.value === "0") {
        showAlert('Por favor, seleccione el estado del libro.', post_state);
        return false;
    }
    if (post_language.value === "0") {
        showAlert('Por favor, seleccione el idioma del libro.', post_language);
        return false;
    }
    if (post_location.textContent.trim() === "") {
        showAlert('Por favor, ingrese la ubicación.', post_location);
        return false;
    }
    return true;
}


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

function submitPost() {
    const url = 'http://localhost:5000/addBook';
    const formData = new FormData();
    
    //User
    // formData.append('user_id', localStorage.getItem('user_id')); // Dev later

    formData.append('user_id', "2");
    formData.append('title', post_title.value);
    formData.append('description', post_description.value);
    formData.append('price', post_price.value);
    formData.append('category', getSelectedRadioText(post_category));
    formData.append('launch_year', post_launch_year.value);
    formData.append('publisher', post_publisher.value);
    formData.append('author', post_author.value);
    formData.append('state', post_state.value);
    formData.append('language', post_language.value);
    formData.append('location_lat', post_location.textContent.split(",")[0].split(":")[1].trim());
    formData.append('location_lng', post_location.textContent.split(",")[1].split(":")[1].trim());
    formData.append('tags_selected', JSON.stringify(tags_selected));

    img_srcs.forEach((img, index) => {
        formData.append(`image_${index}`, img);
    });

    showLoading();  // Mostrar animación de carga antes de enviar los datos

    fetch(url, {
        method: 'POST',
        body: formData
    })
    .then(response => {
        hideLoading();  // Ocultar animación de carga al recibir la respuesta

        if (response.ok) {
            Swal.fire({
                title: 'Producto publicado',
                text: 'El producto ha sido publicado exitosamente.',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                window.location.href = 'manage_posts';
            });
        } else {
            // Set null the variables
            tags_selected = [];

            Swal.fire({
                title: 'Error!',
                text: 'Ha ocurrido un error al publicar el producto.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    })
    .catch(error => {
        hideLoading();  // Ocultar animación de carga en caso de error

        console.error('Error:', error);
        Swal.fire({
            title: 'Error!',
            text: 'Ha ocurrido un error al publicar el producto.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    });
}

function getSelectedRadioText(radioGroup) {
    const radios = radioGroup.querySelectorAll('input[type="radio"]');
    for (const radio of radios) {
        if (radio.checked) {
            return radio.parentElement.textContent.trim();
        }
    }
    return null;
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
    radioVenta = document.getElementById("radio-venta");
    radioIntercambio = document.getElementById("radio-intercambio");

    // Event listeners
    btnSubmit.addEventListener("click", () => {

        if (validateForm()) {
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
        }
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

    // Validación del input de precio
    post_price.addEventListener("input", () => {
        if (/^\d+$/.test(post_price.value)) {
            radioVenta.checked = true;
            post_price.disabled = false;
        }
    });

    radioVenta.addEventListener("change", () => {
        post_price.disabled = false;
    });

    radioIntercambio.addEventListener("change", () => {
        post_price.value = "0";
        post_price.disabled = true;
    });
}

document.addEventListener("DOMContentLoaded", init);
