const http = require("http");
const express = require("express");

const app = express();
app.use(express.static("public"));

app.set("port", "3000");

const server = http.createServer(app);
server.on("listening", () => {
  console.log("Listening on port 3000");
});

// Web sockets
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.sockets.on("connection", (socket) => {
  socket.on("drawPath", (data) => {
    socket.broadcast.emit("path", data[1])
  });
  // 	// console.log('Client connected: ' + socket.id)

  // 	// socket.on('mouse', (data) => socket.broadcast.emit('mouse', data))

  socket.on("disconnect", () => console.log("Client has disconnected"));
});

server.listen("3001");
