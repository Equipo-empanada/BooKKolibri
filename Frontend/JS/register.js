/*
Script para el registro de usuarios

*/

var email;
var password;
var password2;
var crear_cuenta_btn;



function init() {
    email = document.getElementById("user-email");
    password = document.getElementById("user-password");
    password2 = document.getElementById("user-confirma");
    crear_cuenta_btn = document.getElementById("btnIniciar-sesion");

    crear_cuenta_btn.addEventListener("click", register);
}

document.addEventListener("DOMContentLoaded", init);