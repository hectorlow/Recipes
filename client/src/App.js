import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import AppLogin from './screens/loginScreens/AppLogin';
import AppDashboard from './screens/dashboardScreens/AppDashboard';
import RecipesPreview  from './screens/RecipesPreview';
import './App.scss';

const App = () => (
  <Router>
    <Switch>
      <Route path="/" exact component={AppLogin} />
      <Route path="/login" component={AppLogin} />
      <Route path="/signup" component={AppLogin} />
      <Route path="/preview" component={RecipesPreview} />
      <Route path="/add-recipe" component={AppDashboard} />
      <Route path="/recipes" component={AppDashboard} />
      <Route path="/favourites" component={AppDashboard} />
      <Route path="/profile" component={AppDashboard} />
    </Switch>
  </Router>
);

export default App;
