/*
login script
*/

var btnIniciar_sesion;

function login(event) {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    var usuario = document.getElementById("user_email").value;
    var password = document.getElementById("user_password").value;

    fetch('/sign_in', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email_user: usuario, password_user: password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === "User authenticated successfully") {
            swal("Bienvenido", "Inicio de sesión exitoso", "success").then((value) => {
                window.location.href = "/";
            });
        } else {
            swal("Error", "Usuario o contraseña incorrecta", "error");
        }
    })
    .catch(error => console.log('Error:', error));
}

//DOM ready
function init() {
    btnIniciar_sesion = document.getElementById("btnIniciar_sesion");
    btnIniciar_sesion.addEventListener("click", login);
}

document.addEventListener("DOMContentLoaded", init);
