var io = require("socket.io");
var app = require("express")();
var rtDB = require("rethinkdb");

app.listen(8080);
io.listen(app);

console.log("app is listening on 8080");

io.on("connection", function(socket){
	console.log("connected to socket");
});

app.use(__dirname + "index.html");

rtDB.connect({ db: 'testdb' }).then(function(conn) {
  rtDB.table('orders').changes().run(conn, function(err, cursor) {
    cursor.each(function(err, item) {
      io.emit("orders_updated", item);
    });
  });
});
