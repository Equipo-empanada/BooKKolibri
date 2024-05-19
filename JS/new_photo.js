const imgenesCarga = document.getElementsByClassName("img-carga");
const inputImg = document.getElementsByClassName("input-img");
const spanPreview = document.getElementsByClassName("preview");

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
