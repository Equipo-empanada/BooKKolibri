const editarPost = document.getElementsByClassName("editar-post");
const nuevoPost = document.getElementById("add-post");


const postEdit = Array.from(editarPost);

postEdit.forEach(post => {
    post.addEventListener('click',function(){
        window.location.href = "new_product.html";
    });
});

nuevoPost.addEventListener('click',function(){
    window.location.href = "new_product.html";
});
