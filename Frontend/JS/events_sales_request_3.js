const divCedula = document.getElementById("div-cedula");

const fileCedula = document.getElementById("cedula");

const btnEnviar = document.getElementById("enviar_form");
const btnAtras_2 = document.getElementById("atr_2")

divCedula.addEventListener("click",function(){
    fileCedula.click();
});

btnAtras_2.addEventListener('click',function(){
    window.location.href = "sales_request_2";
});


function changeRole(event){
    event.preventDefault(); // Evitar el envío del formulario por defecto

    // Fetch para cambiar el rol del usuario
    fetch("/set_store_role", {
        method: "GET"
    })
    .then(response => {
        if (response.status === 200) {
            Swal.fire({
                title: '¡Rol cambiado!',
                text: 'Ahora eres un proveedor',
                icon: 'success'
            }).then(() => {
                window.location.href = "/"; // Redirigir al index
            });
        } else {
            Swal.fire({
                title: '¡Error!',
                text: 'Error al registrarte como tienda',
                icon: 'error'
            });
            throw new Error("Error al cambiar el rol del usuario");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        Swal.fire({
            title: '¡Error!',
            text: 'Ocurrió un error',
            icon: 'error'
        });
    });
}


btnEnviar.addEventListener("click", changeRole);
