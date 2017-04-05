/*globals $:false,JSON:false,Vue:true */

var app = new Vue({
  el: '#app',
  data: {
    user : "",
    isLogged : false,
    isOnline : false,
    messages: [],
    message : "",
    socket : null
  },
  methods : 
    {
        onSubmit : function() {
            app.socket.send(JSON.stringify({
                type : "message",
                message : app.message,
                user : app.user
            }));
            app.message = "";
            
        },
        onLogin : function() {
            if (app.socket && app.socket.readyState == 1) {
                app.socket.close();
                app.isLogged = false;
            } else {
                app.socket = createSocket();
                app.socket.onopen = function() {
                    app.isLogged = true;
                    app.isOnline = true;
                    app.socket.send(JSON.stringify({
                        type : "open",
                        user : app.user
                    }));
                };
                app.socket.onclose = function(evt) {
                    app.isOnline = false;
                    if (evt.code == 1006) {
                        console.log("reconnect");
                    }
                };
                app.socket.onmessage = function(evt) {
                    var data = JSON.parse(evt.data);
                    app.messages.unshift(data);
                };
            }
        }
    }
});

function createSocket() {
    var socket = new WebSocket("ws://"+window.location.hostname+":5000");

    // // socket.onopen = function () {
    // //     console.log(this);
    // //    // this.sendMessage(this, null, "open");
    // // };

    // // Log errors
    // socket.onerror = function (error) {
    //     console.log(error);
    //     console.log('WebSocket Error ' + error);
    // };

    // // Log messages from the server
    // socket.onmessage = function (e) {
    //     var data = JSON.parse(e.data);

    //     app.messages.unshift(data);
    //     console.log('Server: ' + e.data);
    // };

    // socket.onclose = function() {
    //     this.sendMessage(this, null, "close");
    // };

    return socket;
}
