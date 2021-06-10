import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import ScreensLogin from 'screens/Login';
import ScreensSignup from 'screens/Signup';
import './App.scss';

const App = () => (
  <Router>
    <Switch>
      <Route path="/" exact component={ScreensLogin} />
      <Route path="/login" component={ScreensLogin} />
      <Route path="/signup" component={ScreensSignup} />
    </Switch>
  </Router>
);

export default App;
