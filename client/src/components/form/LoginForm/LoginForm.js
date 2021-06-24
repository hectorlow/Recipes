import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import FormTemplate from 'components/form/FormTemplate';
import ButtonBase from 'components/UI/ButtonBase';
import './LoginForm.scss';

const useStyles = makeStyles({
  button: {
    fontSize: 16,
    backgroundColor: '#5A402F',
    padding: 16,
    width: 160,
    borderRadius: 100,
  },
});

const LoginForm = () => {
  const classes = useStyles();
  const history = useHistory();
  const [username, setUsername] = useState('hec2');
  const [password, setPassword] = useState('superstrong');

  const handleSubmit = () => {
    axios
      .post(
        `${process.env.REACT_APP_HOST_URL}/api/login`,
        {
          username,
          password,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        localStorage.setItem('username', res.data.username);
        history.push('/recipes');
      })
      .catch((error) => {
        alert(error.request.response);
        console.log(error.request.response, 'error response');
      });
  };

  const formFields = [
    {
      label: 'Username',
      value: username,
      onChange: setUsername,
    },
    { label: 'Password', value: password, onChange: setPassword },
  ];

  const submitButton = () => (
    <ButtonBase label="Login" onClick={handleSubmit} classes={classes.button} />
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
