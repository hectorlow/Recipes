import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, Switch, Route } from 'react-router-dom';
import { Grid, Hidden } from '@material-ui/core';
import Navbar from 'components/Navbar';
import Login from 'screens/loginScreens/Login';
import Signup from 'screens/loginScreens/Signup';
import Recipe from 'screens/dashboardScreens/Recipe';
import Recipes from 'screens/dashboardScreens/Recipes';
import autumnSoup from 'images/autumn_soup.jpg';
import './AppLogin.scss';

const renderLoginNavbar = () => (
  <Navbar
    routes={[
      { label: 'Recipes', path: '/preview' },
      { label: 'Login', path: '/login' },
      { label: 'Signup', path: '/signup' },
    ]}
  />
);

const AppLogin = ({ match }) => {
  if (match.path.includes('/preview')) {
    return (
      <div className="AppLogin__preview">
        <Grid container>
          <Grid item xs={12} sm={6} />
          <Grid item xs={12} sm={6}>
            <div className="AppLogin__navbar">{renderLoginNavbar()}</div>
          </Grid>
        </Grid>
        <section className="AppLogin__preview-content">
          <Switch>
            <Route path="/preview" exact component={Recipes} />
            <Route path="/preview/:recipeName" component={Recipe} />
          </Switch>
        </section>
      </div>
    );
  }
  return (
    <Grid container direction="row">
      <Hidden xsDown>
        <Grid item xs={6} className="AppLogin__grid-image">
          <img src={autumnSoup} alt="" className="AppLogin__photo" />
        </Grid>
      </Hidden>

      <Grid item xs={12} sm={6}>
        <section className="AppLogin__form-section">
          <nav className="AppLogin__navbar">{renderLoginNavbar()}</nav>
          <Switch>
            <Route path="/" exact component={Login} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
          </Switch>
        </section>
      </Grid>
    </Grid>
  );
};

AppLogin.propTypes = {
  match: PropTypes.shape({
    path: PropTypes.string,
  }).isRequired,
};

export default withRouter(AppLogin);
