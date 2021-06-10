import React, { useState } from 'react';
import FormTemplate from 'components/form/FormTemplate';
import './LoginForm.scss';

const LoginForm = () => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    console.log(emailOrUsername, password);
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
      submitButtonText="Register"
    />
  );
};

export default LoginForm;
