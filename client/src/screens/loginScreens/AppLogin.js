import React from 'react';
import { withRouter, Switch, Route } from 'react-router-dom';
import { Grid, Hidden } from '@material-ui/core';
import Navbar from 'components/Navbar';
import Login from 'screens/loginScreens/Login';
import Signup from 'screens/loginScreens/Signup';
import autumnSoup from 'images/autumn_soup.jpg';
import './AppLogin.scss';

const AppLogin = () => {
  return (
    <Grid container direction="row">
      <Hidden xsDown>
        <Grid item xs={6} className="AppLogin__grid-item">
          <img src={autumnSoup} alt="" className="AppLogin__photo" />
        </Grid>
      </Hidden>

      <Grid item xs={12} sm={6}>
        <section className="AppLogin__form-section">
          <nav className="AppLogin__navbar">
            <Navbar
              routes={[
                { label: 'Recipes', path: '/preview' },
                { label: 'Login', path: '/login' },
                { label: 'Signup', path: '/signup' },
              ]}
            />
          </nav>
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

export default withRouter(AppLogin);
