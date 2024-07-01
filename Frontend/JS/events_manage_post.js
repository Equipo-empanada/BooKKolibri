
var editarPost;
var nuevoPost;
var deletePostBton;
var tabla;
var tabla_body;

const testItems = [	{
    "id": 1,
    "title": "Producto 1",
    "author": "Descripcion del producto 1",
    "genre": "Genero 1",
    "image_src": "https://via.placeholder.com/150",
  },
  {
    "id": 2,
    "title": "Producto prueba 2",
    "author": "Descripcion del producto ",
    "genre": "Genero 1",
    "image_src": "https://via.placeholder.com/150",
  },
  

];


function deletePost(){
    swal({
        title: "¿Está seguro de eliminar la publicación?",
        text: "Una vez eliminada, no se podrá recuperar!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
          //Remove the post from the database

          swal("Su publicación ha sido eliminada", {
            icon: "success",
          });
          //Remove the post from the database
        } else {
          swal("Su publicación está a salvo!");
        }
      });
}


function loadItems(){
    testItems.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>
                <img class="btn-tabla editar-post" src="./assets/icon_edit.svg" alt="editar">
                <img class="btn-tabla delete-post" src="./assets/icon_trash.svg" alt="delete">
            </td>
            <td>${item.id}</td>
            <td>${item.title}</td>
            <td>${item.author}</td>
            <td>${item.genre}</td>
            <td><img src="${item.image_src}" alt="Imagen del producto"></td>
            
        `;
        tabla_body.appendChild(row);
    });
}

function init(){
    editarPost = document.getElementsByClassName("editar-post");
    nuevoPost = document.getElementById("add-post");
    deletePostBton = document.getElementsByClassName("btn-tabla delete-post");
    tabla = document.getElementsById("tabla");
    tabla_body = document.getElementsByClassName("tabla-body")[0];


    loadItems();
    const postEdit = Array.from(editarPost);
    const deletePostItem = Array.from(deletePostBton);

    
    deletePostItem.forEach(item => {
        item.addEventListener('click',deletePost);
    });


    postEdit.forEach(post => {
        post.addEventListener('click',function(){
            window.location.href = "new_product.html";
        });
    });

    nuevoPost.addEventListener('click',function(){
        window.location.href = "new_product.html";
    });
}

document.addEventListener("DOMContentLoaded", init);



