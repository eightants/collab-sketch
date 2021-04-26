/* eslint-disable */
const http = require("http");
const express = require("express");
const path = require("path");

const app = express();
const buildPath = path.join(__dirname, "../client/", "build");
app.use(express.static(buildPath));
const PORT = process.env.PORT || 3001;

app.get("*", function (req, res) {
  res.sendFile(path.join(buildPath, "index.html"));
});

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

// List of all current users on server
const users = [];

io.sockets.on("connection", (socket) => {

  // // Notify other users of new user
  // socket.broadcast.emit("user connected", {
  //   userID: socket.id,
  //   // username: socket.username,
  // });

  // Update list of all current users on server
  // const users = [];
  // for (let [id, socket] of io.of("/").sockets) {
  //   users.push({
  //     userID: id,
  //     // username: socket.username,
  //   });
  // }

  // socket.emit(users);

  // Add new users to list
  users.push({
    userID: socket.id,
    // username: socket.username,
  });

  console.log(users);

  const time = {
    minutes: 0,
    seconds: 35
  }
  const { timer } = require("./timer");
  socket.on("startTimer", () => {
    timer(io, users, time.minutes, time.seconds);
  });

  sketchStore.getStrokes().forEach((stroke) => {
    socket.emit("path", stroke);
  });

  socket.on("drawPath", (data) => {
    socket.broadcast.emit("path", data[1]);
    sketchStore.saveStrokes(data[1]);
  });
  // 	// console.log('Client connected: ' + socket.id)

  // 	// socket.on('mouse', (data) => socket.broadcast.emit('mouse', data))

  socket.on("disconnect", () => {
    let i = 0;
    while (i < users.length) {
      if (users[i].userID === socket.id) {
        users.splice(i, 1);
        break;
      } else {
        ++i;
      }
    }

    console.log("Client has disconnected: " + socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
