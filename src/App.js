import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";

import Home from "./containers/Home";

function App() {
  return (
    <Router>
      <Switch>
        <Router path="/">
          <Home />
        </Router>
      </Switch>
    </Router>
  );
}

export default App;
