/* eslint-disable */
const http = require('http');
const express = require('express');
const path = require('path');

const app = express();
const buildPath = path.join(__dirname, '../client/', 'build');
app.use(express.static(buildPath));
const PORT = process.env.PORT || 3001;

app.get('*', function (req, res) {
  res.sendFile(path.join(buildPath, 'index.html'));
});

const server = http.createServer(app);

const { InMemorySketchStore } = require('./sketchStore');
const sketchStore = {};

const { InMemoryLobbyInfo } = require('./lobbyInfo');
const lobbies = {};

// Web sockets
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

io.sockets.on('connection', (socket) => {
  console.log('Connected', socket.id);

  socket.on('startCanvas', (id) => {
    if (sketchStore[id]) {
      sketchStore[id].getStrokes().forEach((stroke) => {
        io.sockets.to(id).emit('path', stroke);
      });
    }
  });

  socket.on('drawPath', ({ id, data }) => {
    io.sockets.to(id).emit('path', data[1]);
    if (sketchStore[id]) {
      sketchStore[id].saveStrokes(data[1]);
    } else {
      sketchStore[id] = new InMemorySketchStore();
      sketchStore[id].saveStrokes(data[1]);
    }
  });

  socket.on('onCreateLobby', (lobby) => {
    if (!lobby.id) return;
    lobbies[lobby.id] = new InMemoryLobbyInfo({ ...lobby, host: socket.id });
    socket.emit('newLobbyCreated', { ...lobby, mySocketId: socket.id });
    socket.join(lobby.id);
  });

  socket.on('onJoinLobby', (user) => {
    const room = io.sockets.adapter.rooms.get(user.id);
    // If the room exists...
    if (room != undefined) {
      // Join the room
      socket.join(user.id);
      const newUser = {
        nickname: user.nickname || 'Anonymous',
        sid: socket.id,
        id: user.id
      };
      lobbies[user.id].addMember(newUser);

      // Emit an event notifying the clients that the player has joined the room.
      if (lobbies[user.id].getStarted()) {
        io.sockets
          .in(user.id)
          .emit('joinedStartedLobby', lobbies[user.id].getMembers());
        io.sockets.to(socket.id).emit('gameStarted', user.id);
      } else {
        io.sockets
          .in(user.id)
          .emit('joinedLobby', lobbies[user.id].getMembers());
      }
    } else {
      socket.emit('error', { message: 'This room does not exist.' });
    }
  });

  socket.on('onLeave', (id) => {
    try {
      socket.leave(id);
      lobbies[id].removeMember(socket.id);
      io.sockets.to(socket.id).emit('leaveLobby');
      io.sockets.in(id).emit('joinedLobby', lobbies[id].getMembers());
    } catch (e) {
      io.sockets.to(socket.id).emit('leaveLobby');
    }
  });

  socket.on('kickUser', (sid) => {
    io.sockets.to(sid).emit('kickedUser');
  });

  socket.on('checkPermissions', (id) => {
    if (lobbies[id]) {
      io.sockets
        .to(socket.id)
        .emit('isHost', lobbies[id].getHost() === socket.id);
    } else {
      io.sockets.to(socket.id).emit('roomError', {});
    }
  });

  socket.on('getLobbyUsers', (id) => {
    if (lobbies[id]) {
      io.sockets.to(socket.id).emit('lobbyUsers', lobbies[id].getMembers());
    }
  });

  socket.on('onStartGame', (id) => {
    try {
      lobbies[id].setStarted(true);
      io.sockets.to(id).emit('gameStarted', id);
    } catch (e) {}
  });

  //  When visiting the draw/ link directly, check if socket is already in room
  socket.on('onDrawJoin', (id) => {
    const currentRooms = io.sockets.adapter.sids.get(socket.id);
    if (!currentRooms.has(id)) {
      console.log(socket.id, 'not in room', id);
      io.sockets.to(socket.id).emit('notJoined', id);
    }
  });

  //  When visiting the draw/ link directly, check if socket is already in room
  socket.on('onDrawJoinStarted', (id) => {
    const currentRooms = io.sockets.adapter.sids.get(socket.id);
    if (lobbies[id] && !currentRooms.has(id)) {
      console.log(socket.id, 'not in started room', id);
      io.sockets.to(socket.id).emit('notJoinedStarted', id);
    }
  });

  socket.on('disconnect', () => console.log('Client has disconnected'));
});

server.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
