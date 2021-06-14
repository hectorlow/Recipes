import React, { useState } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import FormTemplate from 'components/form/FormTemplate';
import FormButton from 'components/form/FormButton';
import './SignupForm.scss';

const useStyles = makeStyles({
  button: {
    color: 'white',
    fontWeight: 700,
    backgroundColor: '#FFA600',
    padding: 20,
    width: 200,
    borderRadius: 100,
  },
});

const SignupForm = () => {
  const classes = useStyles();
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

  const submitButton = () => (
    <FormButton label="Login" onClick={handleSubmit} classes={classes.button} />
  );

  return (
    <FormTemplate
      title="Signup"
      formFields={formFields}
      onFormSubmit={handleSubmit}
      SubmitButton={submitButton}
    />
  );
};

export default SignupForm;
