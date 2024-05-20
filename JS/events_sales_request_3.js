const divCedula = document.getElementById("div-cedula");

const fileCedula = document.getElementById("cedula");

const btnEnviar = document.getElementById("enviar_form");
const btnAtras_2 = document.getElementById("atr_2")

divCedula.addEventListener("click",function(){
    fileCedula.click();
});

btnAtras_2.addEventListener('click',function(){
    window.location.href = "sales_request_2.html";
});