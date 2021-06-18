import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import LoginForm from 'components/form/LoginForm';
import AlertSnackbar from 'components/UI/AlertSnackbar';
import './Login.scss';

const Login = ({ location }) => {
  const [newUsernackbar, setNewUserSnackbar] = useState(false);

  useEffect(() => {
    if (location.state && 'newUser' in location.state) {
      setNewUserSnackbar(true);
    }
  }, []);

  return (
    <section className="Login__form-section">
      <AlertSnackbar
        open={newUsernackbar}
        message="Account created! Login to continue"
        onClose={() => setNewUserSnackbar(false)}
      />
      <div className="Login__loginForm-container">
        <div className="Login__loginForm">
          <LoginForm />
        </div>
      </div>
    </section>
  );
};

Login.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({}),
  }).isRequired,
};

export default Login;
