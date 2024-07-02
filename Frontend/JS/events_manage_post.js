var editarPost;
var nuevoPost;
var deletePostBton;
var tabla;
var tabla_body;

var posts = [];

// Mostrar animación de carga
function showLoading() {
    swal({
        title: "Cargando...",
        text: "Por favor espera mientras se cargan los datos",
        icon: "info",
        buttons: false,
        closeOnClickOutside: false,
        closeOnEsc: false
    });
}

// Ocultar animación de carga
function hideLoading() {
    swal.close();
}

// Obtener y cargar libros (AJAX GET request)
function getBooks() {
    showLoading();  // Mostrar animación de carga antes de obtener los datos

    fetch("http://localhost:5000/posts")
        .then(response => response.json())
        .then(data => {
            posts = data;
            console.log(posts);
            loadItems();
            attachEventListeners();  // Añadir los listeners después de cargar los items
            hideLoading();  // Ocultar animación de carga después de cargar los datos
        })
        .catch(error => {
            console.log(error);
            hideLoading();  // Ocultar animación de carga en caso de error
            swal("Error", "No se pudieron cargar los datos", "error");
        });
}

// Eliminar publicación (AJAX DELETE request)
function deletePost(event) {
    const row = event.target.closest('tr');
    const id = row.getAttribute("data-id");

    swal({
        title: "¿Está seguro de eliminar la publicación?",
        text: "Una vez eliminada, no se podrá recuperar!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
    .then((willDelete) => {
        if (willDelete) {
            showLoading();  // Mostrar animación de carga durante la eliminación

            fetch(`http://localhost:5000/posts?publication_id=${id}`, {
                method: 'DELETE',
            })
            .then(response => {
                if (response.ok) {
                    swal("Su publicación ha sido eliminada", {
                        icon: "success",
                    });
                    getBooks();  // Volver a cargar los libros después de eliminar
                } else {
                    swal("Error, no se pudo eliminar la publicación", {
                        icon: "error",
                    });
                }
            })
            .catch(error => {
                console.log(error);
                swal("Error, no se pudo eliminar la publicación", {
                    icon: "error",
                });
            })
            .finally(() => {
                hideLoading();  // Ocultar animación de carga después de completar la eliminación
            });
        } else {
            swal("Su publicación está a salvo!");
        }
    });
}

// Cargar items en la tabla
function loadItems() {
    tabla_body.innerHTML = ''; // Limpiar la tabla antes de agregar filas nuevas
    posts.forEach(item => {
        const row = document.createElement("tr");
        row.classList.add("tabla-row");
        row.setAttribute("data-id", item.publication_id);

        // Utilizar la imagen obtenida del servidor o una de reserva si no existe
        const imageUrl = item.image_src || "https://via.placeholder.com/150";

        row.innerHTML = `
            <td>
                <img class="btn-tabla editar-post" src="../Frontend/assets/icon_edit.svg" alt="editar">
                <img class="btn-tabla delete-post" src="../Frontend/assets/icon_trash.svg" alt="delete">
            </td>
            <td>${item.title}</td>
            <td>${item.author}</td>
            <td>${item.tags}</td>
            <td><img src="${imageUrl}" alt="Imagen del producto"></td>
        `;
        tabla_body.appendChild(row);
    });
}

// Añadir event listeners a los botones de eliminar y editar
function attachEventListeners() {
    deletePostBton = document.getElementsByClassName("btn-tabla delete-post");
    const deletePostItem = Array.from(deletePostBton);
    deletePostItem.forEach(item => {
        item.addEventListener('click', deletePost);
    });

    editarPost = document.getElementsByClassName("editar-post");
    const postEdit = Array.from(editarPost);
    postEdit.forEach(post => {
        post.addEventListener('click', function() {
            window.location.href = "new_product";
        });
    });
}

function init() {
    nuevoPost = document.getElementById("add-post");
    tabla = document.getElementById("tabla");
    tabla_body = document.getElementsByClassName("tabla-body")[0];

    getBooks();  // Cargar los libros al iniciar

    nuevoPost.addEventListener('click', function() {
        window.location.href = "new_product";
    });
}

document.addEventListener("DOMContentLoaded", init);
