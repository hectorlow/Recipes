import React, { useState } from 'react';
import axios from 'axios';
import FormTemplate from 'components/form/FormTemplate';
import './SignupForm.scss';

const SignupForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    axios
      .post('http://localhost:5000/api/signup', {
        username,
        email,
        password,
      })
      .then((response) => {
        console.log(response.data, 'signup response');
      })
      .catch((error) => {
        console.log(error.request.response, 'error response');
      });
  };

  const formFields = [
    { label: 'Username', value: username, onChange: setUsername },
    { label: 'Email', value: email, onChange: setEmail },
    { label: 'Password', value: password, onChange: setPassword },
  ];

  return (
    <FormTemplate
      title="Signup"
      formFields={formFields}
      onFormSubmit={handleSubmit}
      submitButtonText="Register"
    />
  );
};

export default SignupForm;
