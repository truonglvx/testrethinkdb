
var express = require('express');
var r = require('rethinkdb');

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

console.log("App is listening on 8008");

io.on('connection', function(socket) {
  console.log('connected to socket');
});

app.use(express.static(__dirname + "/index.html"));

r.connect({ db: 'testdb' }).then(function(conn) {
  r.table('orders').changes().run(conn, function(err, cursor) {
    cursor.each(function(err, item) {
      io.emit("orders_updated", item);
    });
  });
});


server.listen(8080);