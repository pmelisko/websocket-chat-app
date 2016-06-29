// web part
var app = require('express')();
var http = require('http').Server(app);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/client/index.html');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});


// socket part

var PORT = 5555;
var ws = require("nodejs-websocket");
var connections = [];

ws.createServer(function (conn) {
    connections.push(conn);
    conn.on("text", function (str) {
        broadcast(str);
    });
    conn.on("close", function (/*code, reason*/) {
    	var idx = connections.indexOf(conn);
    	~idx && connections.splice(idx, 1);
        console.log("Connection closed");
       	broadcast("client closed");
    });
}).listen(PORT);

function broadcast(message) {
	connections.forEach(function(c) {
		c.sendText(message);
	});
}