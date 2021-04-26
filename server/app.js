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
const sketchStore = {};

const { InMemoryLobbyInfo } = require("./lobbyInfo");
const lobbies = {};

// Web sockets
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.sockets.on("connection", (socket) => {
  socket.on("startCanvas", (id) => {
    if (sketchStore[id]) {
      sketchStore[id].getStrokes().forEach((stroke) => {
        io.sockets.to(id).emit("path", stroke);
      });
    }
  });

  socket.on("drawPath", ({ id, data }) => {
    io.sockets.to(id).emit("path", data[1]);
    if (sketchStore[id]) {
      sketchStore[id].saveStrokes(data[1]);
    } else {
      sketchStore[id] = new InMemorySketchStore();
      sketchStore[id].saveStrokes(data[1]);
    }
  });

  socket.on("onCreateLobby", (lobby) => {
    if (!lobby.id) return;
    lobbies[lobby.id] = new InMemoryLobbyInfo(lobby);
    socket.emit("newLobbyCreated", { ...lobby, mySocketId: socket.id });
    socket.join(lobby.id);
  });

  socket.on("onJoinLobby", (gameId) => {
    const room = io.sockets.adapter.rooms.get(gameId);

    // If the room exists...
    if (room != undefined) {
      // Join the room
      socket.join(gameId);
      // Emit an event notifying the clients that the player has joined the room.
      io.sockets
        .in(gameId)
        .emit("joinedLobby", { name: "Anonymous", id: gameId });
    } else {
      socket.emit("error", { message: "This room does not exist." });
    }
  });

  socket.on("onStartGame", (id) => {
    lobbies[id].setStarted(true);
    io.sockets.in(id).emit("gameStarted", {});
  });

  //  When visiting the draw/ link directly, check if socket is already in room
  socket.on("onDrawJoin", (id) => {
    const currentRooms = io.sockets.adapter.sids.get(socket.id);
    if (!currentRooms.has(id)) {
      io.sockets.to(socket.id).emit("notJoined", id);
    }
  });

  socket.on("disconnect", () => console.log("Client has disconnected"));
});

server.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
