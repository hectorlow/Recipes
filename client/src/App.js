import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import AppLogin from './screens/loginScreens/AppLogin';
import AppDashboard from './screens/dashboardScreens/AppDashboard';
import './App.scss';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={AppLogin} />
        <Route path="/login" component={AppLogin} />
        <Route path="/signup" component={AppLogin} />
        <Route path="/preview" exact component={AppLogin} />
        <Route path="/preview/:recipeName" component={AppLogin} />

        {/* user logged in screen */}
        <Route path="/add-recipe" component={AppDashboard} />
        <Route path="/recipes" exact component={AppDashboard} />
        <Route path="/recipes/:recipeName" component={AppDashboard} />
        <Route path="/favourites" component={AppDashboard} />
        <Route path="/profile" component={AppDashboard} />
      </Switch>
    </Router>
  );
};

export default App;
