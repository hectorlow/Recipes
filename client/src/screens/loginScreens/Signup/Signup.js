import React from 'react';
import SignupForm from 'components/form/SignupForm';
import './Signup.scss';

const Signup = () => (
  <section className="Signup__form-section">
    <div className="Signup__loginForm-container">
      <div className="Signup__loginForm">
        <SignupForm />
      </div>
    </div>
  </section>
);

export default Signup;
