// static/JS/update_user_info.js

document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const submitButton = form.querySelector('button[type="submit"]');

    submitButton.addEventListener('click', function(event) {
        event.preventDefault(); 

        const formData = new FormData(form);
        const userData = {};

        formData.forEach((value, key) => {
            userData[key] = value;
        });
        console.log(userData)
        fetch('/edit_user_info', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert('Datos actualizados correctamente');
            } else {
                alert('Error al actualizar los datos');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al actualizar los datos');
        });
    });
});
