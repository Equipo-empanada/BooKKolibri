/*
login script
*/

var btnIniciar_sesion;

function login() {
    var usuario = document.getElementById("user_email").value;
    var password = document.getElementById("user_password").value;

    if (usuario == "admin" && password == "admin") {
        swal("Bienvenido", "Inicio de sesion exitoso", "success").then((value) => {
                window.location.href = "home.html";
            });
        
    } else {
        swal("Error", "Usuario o contraseña incorrecta", "error");
    }
}




//DOM ready
function init() {
    btnIniciar_sesion = document.getElementById("btnIniciar_sesion");
    btnIniciar_sesion.addEventListener("click", login);
}


document.addEventListener("DOMContentLoaded", init);