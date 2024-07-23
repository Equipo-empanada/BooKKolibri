document.getElementById("store-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Evitar el envío del formulario por defecto
    
    var nombre_comercial = document.getElementById("nom-proveedor").value;
    var ciudad = document.getElementById("ciudad-proveedor").value;
    var cod_postal = document.getElementById("cod-postal-proveedor").value;

    fetch("/register_store", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nombre_comercial: nombre_comercial,
            ciudad: ciudad,
            cod_postal: cod_postal
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === "Tienda registrada exitosamente") {
            // alert("Tienda registrada exitosamente");
            window.location.href = "/sales_request_3"; 
        } else {
            alert("Error: " + data.message);
        }
    })
    .catch(error => {
        console.error("Error:", error);
    });
});

document.getElementById("atr_1").addEventListener('click', function() {
    window.location.href = "/sales_request"; // Cambiar a la URL de la página anterior
});
