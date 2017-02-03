/*globals $:false,JSON:false */
function sendMessage(socket, message, type) {
    type || (type = "message");

    var str = JSON.stringify({
        user : $('#user').val() || "anonymous",
        message : message,
        type : type
    });                   
    socket.send(str);
}

// open connection
var socket = new WebSocket("ws://"+window.location.hostname+":5000");

socket.onopen = function () {
    sendMessage(socket, null, "open");
};

// Log errors
socket.onerror = function (error) {
    console.log(error);
    console.log('WebSocket Error ' + error);
};

// Log messages from the server
socket.onmessage = function (e) {
    var data = JSON.parse(e.data);
    $("#messages").prepend( "<li class='" + (data.style || "") + "''>" + data.message + "</li>");
    console.log('Server: ' + e.data);
};

socket.onclose = function() {
    sendMessage(socket, null, "close");
};

$('#socketForm').submit(function(evt){
    evt.preventDefault();
    sendMessage(socket, $('#msg').val());
    $('#msg').val(''); // clear input
    return false;
});

$('#socketForm').change(function(evt) {
    var target = evt.target;
    
    switch (target.id) {
        case "user" : 
            sendMessage(socket, null, "rename");
            break;
        case "msg" :
            sendMessage(socket, null, "typing");
            break;  
    }
});