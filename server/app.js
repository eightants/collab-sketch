const http = require("http");
const express = require("express");

const app = express();
app.use(express.static("public"));

app.set("port", "3000");

const server = http.createServer(app);
server.on("listening", () => {
  console.log("Listening on port 3000");
});

const { InMemorySketchStore } = require("./sketchStore");
const sketchStore = new InMemorySketchStore();

// Web sockets
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.sockets.on("connection", (socket) => {

  // List of all users
  const users = [];
  for (let [id, socket] of io.of("/").sockets) {
      users.push({
          userID: id,
          // username: socket.username,
      });
  }
  console.log(users);

  let drawingUserIdx = 0;

  socket.on("startTimer", () => {
    io.emit("turnStart", users[drawingUserIdx]);
  });

  sketchStore.getStrokes().forEach((stroke) => {
    socket.emit("path", stroke);
  });

  socket.on("drawPath", (data) => {
    socket.broadcast.emit("path", data[1])
    sketchStore.saveStrokes(data[1]);
  });
  // 	// console.log('Client connected: ' + socket.id)

  // 	// socket.on('mouse', (data) => socket.broadcast.emit('mouse', data))

  socket.on("disconnect", () => console.log("Client has disconnected"));
});

server.listen("3001");
