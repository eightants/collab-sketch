import React, { useEffect } from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { io } from "socket.io-client";
import "./App.css";
import { Draw } from "./pages/Draw";
import { Home } from "./pages/Home/Home";
import { Lobby } from "./pages/Lobby";

function App() {
  const socket = io();
  // const socket = io("localhost:3001"); // Used for development
  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  });

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Home socket={socket} />
        </Route>
        <Route exact path="/lobby">
          <Lobby socket={socket} />
        </Route>
        <Route exact path="/draw">
          <Draw socket={socket} />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
