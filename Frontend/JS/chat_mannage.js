document.addEventListener("DOMContentLoaded", function() {
    const socket = io();
    let chat_code;

    // Manejar la recepción de mensajes
        socket.on('message', function(msg) {
        console.log(msg);
        const messageClass = msg.user === $('#user_email').val() ? 'comprador' : 'vendedor';
        $('#messages_chat').append(`
            <li class="chat_message ${messageClass}">
                <div class="chat_message_struct">
                    <div class="chat_message_tab">
                        <img src="../Frontend/static/perfil_photos/default.png" alt="product_img">
                    </div>
                    <div class="chat_message_content">
                        <div class="chat_message_text">
                            <span>${msg.text}</span>
                        </div>
                    </div>
                </div>
                <div class="chat_message_divisor">${new Date().toLocaleTimeString()}</div>
            </li>
        `);
    });

    document.querySelectorAll('#show_message').forEach(button => {
        button.addEventListener('click', function() {
            chat_code = button.getAttribute('data-chat-code');
            console.log(chat_code);

            if (chat_code) {
                socket.emit('join', { room: chat_code });

                // Cargar mensajes desde el servidor
                fetch(`/chat_message/${chat_code}`)
                    .then(response => response.json())
                    .then(messages => {
                        const messagesChat = document.getElementById('messages_chat');
                        messagesChat.innerHTML = ''; // Limpiar mensajes anteriores
                        messages.forEach(message => {
                            const messageClass = message.usuario === $('#user_email').val() ? 'comprador' : 'vendedor';
                            messagesChat.innerHTML += `
                                <li class="chat_message ${messageClass}">
                                    <div class="chat_message_struct">
                                        <div class="chat_message_tab">
                                            <img src="../Frontend/static/perfil_photos/default.png" alt="product_img">
                                        </div>
                                        <div class="chat_message_content">
                                            <div class="chat_message_text">
                                                <span>${message.texto}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="chat_message_divisor">${message.fecha}</div>
                                </li>
                            `;
                        });
                    });
            }
        });
    });

    // Manejar el envío de mensajes
    $('#chat_input_send_btn').on('click', function() {
        const message = $('#message').val();
        const current_user = $('#user_email').val();
        console.log(chat_code);
        console.log(current_user);

        if (message.trim() !== '' && chat_code) {
            socket.emit('message', {
                text: message,
                user: current_user,
                room: chat_code
            });
            $('#message').val('');
        } else {
            console.log("No hay sala seleccionada");
        }
    });

    // Manejar el envío del formulario de mensajes
    $('#chat_input_form').on('submit', function(e) {
        e.preventDefault(); // Prevenir el comportamiento por defecto del formulario
        const message = $('#message').val();
        const currentUser = $('#user_email').val();

        if (message.trim() !== '' && chat_code) {
            socket.emit('message', {
                text: message,
                user: currentUser,
                room: chat_code
            });
            $('#message').val('');
        }
    });
});