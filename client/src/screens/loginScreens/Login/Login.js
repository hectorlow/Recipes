import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import LoginForm from 'components/form/LoginForm';
import AlertSnackbar from 'components/UI/AlertSnackbar';
import './Login.scss';

const Login = ({ location }) => {
  const [newUsernackbar, setNewUserSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');

  useEffect(() => {
    if (location.state) {
      if ('newUser' in location.state) {
        setNewUserSnackbar(true);
        setSnackbarMsg('Account created! Login to continue');
      }

      if ('sessionExpired' in location.state) {
        setNewUserSnackbar(true);
        setSnackbarMsg('Session expired. Login to continue');
      }
    }
  }, []);

  return (
    <section className="Login__form-section">
      <AlertSnackbar
        open={newUsernackbar}
        message={snackbarMsg}
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
