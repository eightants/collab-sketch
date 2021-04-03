import React from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import "./App.css";
import { Draw } from "./pages/Draw";
import { Home } from "./pages/Home";
import { Lobby } from "./pages/Lobby";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/lobby">
          <Lobby />
        </Route>
        <Route exact path="/draw">
          <Draw />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
