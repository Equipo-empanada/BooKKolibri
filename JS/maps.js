var map = L.map('map').setView([-2.90055, -79.00453], 13); //coordenadas de Cuenquita

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var marker;

// Anadir elemento
map.on('click', function(e) {
    // Eliminar el marcador existente, en caso de que exista
    if (marker) {
        map.removeLayer(marker);
    }
    // agregar
    marker = L.marker(e.latlng).addTo(map);
    // print
    document.getElementById('info').innerText = `Latitud: ${e.latlng.lat}, Longitud: ${e.latlng.lng}`;
});

// barra de busqueda
var geocoder = L.Control.geocoder({
    defaultMarkGeocode: false
})
.on('markgeocode', function(e) {
    var bbox = e.geocode.bbox;
    var poly = L.polygon([
        [bbox.getSouthEast().lat, bbox.getSouthEast().lng],
        [bbox.getNorthEast().lat, bbox.getNorthEast().lng],
        [bbox.getNorthWest().lat, bbox.getNorthWest().lng],
        [bbox.getSouthWest().lat, bbox.getSouthWest().lng]
    ]).addTo(map);
    map.fitBounds(poly.getBounds());

    // centrar
    var center = e.geocode.center;
    if (marker) {
        map.removeLayer(marker);
    }
    marker = L.marker(center).addTo(map);
    document.getElementById('info').innerText = `Latitud: ${center.lat}, Longitud: ${center.lng}`;
})
.addTo(map);