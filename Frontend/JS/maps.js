var map = L.map('map').setView([-2.90055, -79.00453], 13); //coordenadas de Cuenquita

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Definir el JSON en una variable
var locations = [
    { "name": "Monay Shopping", "lat": -2.8974795336361145, "lng": -78.97683803103058 },
    { "name": "Mall del Rio", "lat": -2.9191822647641104, "lng": -79.01465042429851 },
    { "name": "Terminal Terrestre", "lat": -2.889121, "lng": -78.994796 },
    { "name": "Parque Calderón", "lat": -2.90055, "lng": -79.00453 },
    { "name": "Parque de la Madre", "lat": -2.904471395881, "lng": -79.00349354236073 },
    
    // Añade más ubicaciones según sea necesario
];

// Agregar los marcadores al mapa
locations.forEach(location => {
    var marker = L.marker([location.lat, location.lng]).addTo(map);
    marker.bindPopup(location.name);

    marker.on('mouseover', function () {
        this.openPopup();
    });
    marker.on('mouseout', function () {
        this.closePopup();
    });
});

// Añadir lista de ubicaciones
var locationsContainer = document.getElementById('locations');
locations.forEach(location => {
    var locationItem = document.createElement('div');
    locationItem.className = 'location-item';
    locationItem.textContent = location.name;
    locationItem.onclick = function () {
        map.setView([location.lat, location.lng], 13);
        if (marker) {
            map.removeLayer(marker);
        }
        marker = L.marker([location.lat, location.lng]).addTo(map);
        marker.bindPopup(location.name).openPopup();
    };
    locationsContainer.appendChild(locationItem);
});

var marker;

// Añadir elemento
map.on('click', function (e) {
    // Eliminar el marcador existente, en caso de que exista
    if (marker) {
        map.removeLayer(marker);
    }
    // Agregar
    marker = L.marker(e.latlng).addTo(map);
    // Print
    document.getElementById('info').innerText = `Latitud: ${e.latlng.lat}, Longitud: ${e.latlng.lng}`;
});

// Barra de búsqueda
var geocoder = L.Control.geocoder({
    defaultMarkGeocode: false
})
    .on('markgeocode', function (e) {
        var bbox = e.geocode.bbox;
        var poly = L.polygon([
            [bbox.getSouthEast().lat, bbox.getSouthEast().lng],
            [bbox.getNorthEast().lat, bbox.getNorthEast().lng],
            [bbox.getNorthWest().lat, bbox.getNorthWest().lng],
            [bbox.getSouthWest().lat, bbox.getSouthWest().lng]
        ]).addTo(map);
        map.fitBounds(poly.getBounds());

        // Centrar
        var center = e.geocode.center;
        if (marker) {
            map.removeLayer(marker);
        }
        marker = L.marker(center).addTo(map);
        document.getElementById('info').innerText = `Latitud: ${center.lat}, Longitud: ${center.lng}`;
    })
    .addTo(map);