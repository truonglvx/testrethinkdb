var sockio = require("socket.io");
var express = require("express");
var r = require("rethinkdb");

var app = express();
var io = sockio.listen(app.listen(3000));
console.log("App is listening on 3000");

io.sockets.on('connection', function(socket) {
  console.log('connected to socket');
});

app.use(express.static(__dirname + "/public"));

app.get('/home', (req, res) => {
		console.log("home page");
});

r.connect({ db: 'testdb' }).then(function(conn) {
  r.table('orders').changes().run(conn, function(err, cursor) {
    cursor.each(function(err, item) {
      io.emit("orders_updated", item);
    });
  });
});