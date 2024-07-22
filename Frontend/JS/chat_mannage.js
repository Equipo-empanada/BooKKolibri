//Utilizar JQuery para facilitar la conexión
document.addEventListener("DOMContentLoaded",function(){
    const socket = io();
    socket.on('message', function(msg){
        $('#messages_chat').append('<li>'+msg+'</li>')
    });

    $('#chat_input_send_btn').on('click',function(){
        socket.send($('#message').val());
        $('#message').val('');
    });
    
});
// document.addEventListener("DOMContentLoaded", function() {
//     var socket = io.connect('http://' + document.domain + ':' + location.port);
//     var room = "default";

//     // Join the room
//     socket.emit('join', { room: room, username: 'User' });

//     // Listen for messages
//     socket.on('message', function(msg) {
//         var messageList = document.getElementById('messages');
//         var newMessage = document.createElement('li');
//         newMessage.textContent = msg;
//         messageList.appendChild(newMessage);
//     });

//     // Send a message
//     document.getElementById('sendButton').onclick = function() {
//         var messageInput = document.getElementById('message');
//         var message = messageInput.value;
//         socket.emit('message', { room: room, message: message });
//         messageInput.value = '';
//     };

//     // Leave the room when the user navigates away from the page
//     window.onbeforeunload = function() {
//         socket.emit('leave', { room: room, username: 'User' });
//         socket.close();
//     };
// });

// function joinRoom() {
//     var room = document.getElementById('room').value;
//     socket.emit('join', { room: room });
// }

// function leaveRoom() {
//     var room = document.getElementById('room').value;
//     socket.emit('leave', { room: room });
// }
