import React, { useEffect } from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { io } from "socket.io-client";
import "./App.css";
import { Create } from "./pages/Create/Create";
import { Draw } from "./pages/Draw";
import { Home } from "./pages/Home/Home";
import { Join } from "./pages/Join/Join";
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
        <Route exact path="/create">
          <Create socket={socket} />
        </Route>
        <Route exact path="/join/:id?">
          <Join socket={socket} />
        </Route>
        <Route exact path="/lobby/:id">
          <Lobby socket={socket} />
        </Route>
        <Route exact path="/draw/:id">
          <Draw socket={socket} />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
