import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import FormTemplate from 'components/form/FormTemplate';
import './LoginForm.scss';

const LoginForm = () => {
  const history = useHistory();
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    axios
      .post('http://localhost:5000/api/login', {
        username: emailOrUsername,
        password,
      })
      .then((response) => {
        console.log(response.data, 'login response data');
        history.push('/recipes');
      })
      .catch((error) => {
        console.log(error.request.response, 'error response');
      });
  };

  const formFields = [
    {
      label: 'Email or Username',
      value: emailOrUsername,
      onChange: setEmailOrUsername,
    },
    { label: 'Password', value: password, onChange: setPassword },
  ];

  return (
    <FormTemplate
      title="Login"
      formFields={formFields}
      onFormSubmit={handleSubmit}
      submitButtonText="Login"
    />
  );
};

export default LoginForm;
