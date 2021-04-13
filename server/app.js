const http = require("http");
const express = require("express");
const path = require('path');

const app = express();
const buildPath = path.join(__dirname, '../client/', 'build');
app.use(express.static(buildPath));
const PORT = process.env.PORT || 3001;

const server = http.createServer(app);

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

server.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
