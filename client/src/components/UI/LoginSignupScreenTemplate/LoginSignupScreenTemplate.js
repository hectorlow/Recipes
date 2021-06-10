import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Hidden } from '@material-ui/core';
import GuestNavbar from 'components/navbar/GuestNavbar';
import './LoginSignupScreenTemplate.scss';

const LoginSignupScreenTemplate = ({ Form, sideImage }) => (
  <Grid container direction="row">
    <Hidden xsDown>
      <Grid item xs={6} className="LoginSignupScreenTemplate__grid-item">
        <img
          src={sideImage}
          alt=""
          className="LoginSignupScreenTemplate__photo"
        />
      </Grid>
    </Hidden>
    <Grid item xs={12} sm={6}>
      <section className="LoginSignupScreenTemplate__form-section">
        <nav className="LoginSignupScreenTemplate__navbar">
          <GuestNavbar />
        </nav>
        <div className="LoginSignupScreenTemplate__loginForm-container">
          <div className="LoginSignupScreenTemplate__loginForm">
            <Form />
          </div>
        </div>
      </section>
    </Grid>
  </Grid>
);

LoginSignupScreenTemplate.propTypes = {
  Form: PropTypes.func.isRequired,
  sideImage: PropTypes.string.isRequired,
};

export default LoginSignupScreenTemplate;
