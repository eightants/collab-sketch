import React, { useState, useEffect } from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { io } from "socket.io-client";
import "./App.css";
import { Create } from "./pages/Create/Create";
import { Draw } from "./pages/Draw";
import { Home } from "./pages/Home/Home";
import { Join } from "./pages/Join/Join";
import { Lobby } from "./pages/Lobby";

function App() {

  const [socket, setSocket] = useState<any>();
  console.log("render");
  useEffect(() => {
    const initSocket = io();
    // const initSocket = io("localhost:3001");
    setSocket(initSocket);
    console.log("setting socket: " + initSocket.id)

    return () => {
      initSocket.disconnect();
    };
  }, []);

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          {socket && <Home socket={socket} />}
        </Route>
        <Route exact path="/create">
          {socket && <Create socket={socket} />}
        </Route>
        <Route exact path="/join/:id?">
          {socket && <Join socket={socket} />}
        </Route>
        <Route exact path="/lobby/:id">
          {socket && <Lobby socket={socket} />}
        </Route>
        <Route exact path="/draw/:id">
          {socket && <Draw socket={socket} />}
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
