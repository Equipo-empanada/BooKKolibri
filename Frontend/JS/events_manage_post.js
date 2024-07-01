var editarPost;
var nuevoPost;
var deletePostBton;
var tabla;
var tabla_body;

var posts = [];

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

function getBooks(){
    fetch("http://localhost:5000/posts")
    .then(response => response.json())
    .then(data => {
        posts = data;
        console.log(posts);
        loadItems();
    })
    .catch(error => console.log(error));


}



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
  
    posts.forEach(item => {
        const row = document.createElement("tr");
        row.classList.add("tabla-row");
        row.setAttribute("data-id", item.id);
        row.innerHTML = `
            <td>
                <img class="btn-tabla editar-post" src="../Frontend/assets/icon_edit.svg" alt="editar">
                <img class="btn-tabla delete-post" src="../Frontend/assets/icon_trash.svg" alt="delete">
            </td>
            <td>${item.title}</td>
            <td>${item.author}</td>
            <td>${item.category}</td>
            <td><img src="https://via.placeholder.com/150" alt="Imagen del producto"></td>
            
        `;
        tabla_body.appendChild(row);
    });
}

function init(){
    editarPost = document.getElementsByClassName("editar-post");
    nuevoPost = document.getElementById("add-post");
    deletePostBton = document.getElementsByClassName("btn-tabla delete-post");
    tabla = document.getElementById("tabla");
    tabla_body = document.getElementsByClassName("tabla-body")[0];

    getBooks();
    const postEdit = Array.from(editarPost);
    const deletePostItem = Array.from(deletePostBton);

    
    deletePostItem.forEach(item => {
        item.addEventListener('click',deletePost);
    });


    postEdit.forEach(post => {
        post.addEventListener('click',function(){
            window.location.href = "new_product";
        });
    });

    nuevoPost.addEventListener('click',function(){
        window.location.href = "new_product";
    });
}

document.addEventListener("DOMContentLoaded", init);



