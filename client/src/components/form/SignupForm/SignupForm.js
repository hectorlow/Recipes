import React, { useState } from 'react';
import FormTemplate from 'components/form/FormTemplate';
import './SignupForm.scss';

const SignupForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    console.log(username, email, password);
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
