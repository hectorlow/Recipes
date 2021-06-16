import React from 'react';
import LoginForm from 'components/form/LoginForm';
import './Login.scss';

const Login = () => (
  <section className="Login__form-section">
    <div className="Login__loginForm-container">
      <div className="Login__loginForm">
        <LoginForm />
      </div>
    </div>
  </section>
);

export default Login;
