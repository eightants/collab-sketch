import React, { useState, useEffect } from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { io } from "socket.io-client";
import "./App.css";
import { Draw } from "./pages/Draw";
import { Home } from "./pages/Home";
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
        <Route exact path="/lobby">
          {socket && <Lobby socket={socket} />}
        </Route>
        <Route exact path="/draw">
          {socket && <Draw socket={socket} />}
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
