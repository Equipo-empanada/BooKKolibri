
var editarPost;
var nuevoPost;
var deletePostBton;




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
          swal("Su publicación ha sido eliminada", {
            icon: "success",
          });
          //Remove the post from the database
        } else {
          swal("Su publicación está a salvo!");
        }
      });
}

function init(){
    editarPost = document.getElementsByClassName("editar-post");
    nuevoPost = document.getElementById("add-post");
    deletePostBton = document.getElementsByClassName("btn-tabla delete-post");
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



