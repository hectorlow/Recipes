import React from 'react';
import { Grid, Hidden } from '@material-ui/core';
import LoginForm from 'components/form/LoginForm';
import GuestNavbar from 'components/navbar/GuestNavbar';
import avocadoAndEgg from 'src/images/avocado_and_egg.jpg';
import './Login.scss';

const LoginScreen = () => (
  <Grid container direction="row">
    <Hidden xsDown>
      <Grid item xs={6} className="ScreensLogin__grid-item">
        <img src={avocadoAndEgg} alt="" className="ScreensLogin__photo" />
      </Grid>
    </Hidden>
    <Grid item xs={12} sm={6}>
      <section className="ScreensLogin__form-section">
        <nav className="ScreensLogin__navbar">
          <GuestNavbar />
        </nav>
        <div className="ScreensLogin__loginForm-container">
          <div className="ScreensLogin__loginForm">
            <LoginForm />
          </div>
        </div>
      </section>
    </Grid>
  </Grid>
);

export default LoginScreen;
