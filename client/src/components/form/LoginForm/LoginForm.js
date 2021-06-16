import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import FormTemplate from 'components/form/FormTemplate';
import FormButton from 'components/form/FormButton';
import './LoginForm.scss';

const useStyles = makeStyles({
  button: {
    color: 'white',
    fontWeight: 700,
    backgroundColor: '#5A402F',
    padding: 20,
    width: 200,
    borderRadius: 100,
  },
});

const LoginForm = () => {
  const classes = useStyles();
  const history = useHistory();
  const [emailOrUsername, setEmailOrUsername] = useState('hec');
  const [password, setPassword] = useState('superstrong');

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

  const submitButton = () => (
    <FormButton label="Login" onClick={handleSubmit} classes={classes.button} />
  );

  return (
    <FormTemplate
      title="Login"
      formFields={formFields}
      onFormSubmit={handleSubmit}
      SubmitButton={submitButton}
    />
  );
};

export default LoginForm;
