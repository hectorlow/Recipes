import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Login from './screens/loginScreens/Login';
import Signup from './screens/loginScreens/Signup';
import AppDashboard from './screens/dashboardScreens/AppDashboard';
import './App.scss';

const App = () => (
  <Router>
    <Switch>
      <Route path="/" exact component={Login} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/recipes" component={AppDashboard} />
      <Route path="/favourites" component={AppDashboard} />
      <Route path="/profile" component={AppDashboard} />
    </Switch>
  </Router>
);

export default App;
