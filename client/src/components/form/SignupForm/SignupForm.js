import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import FormTemplate from 'components/form/FormTemplate';
import ButtonBase from 'components/UI/ButtonBase';
import './SignupForm.scss';

const useStyles = makeStyles({
  button: {
    fontSize: 16,
    backgroundColor: '#FFA600',
    padding: 16,
    width: 160,
    borderRadius: 100,
  },
});

const SignupForm = () => {
  const history = useHistory();
  const classes = useStyles();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    // validate inputs first
    if (username.length < 0) {
      alert('Username cannot be empty');
      return;
    }
    if (password.length < 8) {
      alert('Please choose a password of at least 8 characters');
      return;
    }

    axios
      .post(`${process.env.REACT_APP_HOST_URL}/api/signup`, {
        username,
        password,
      })
      .then(() => {
        history.push('/login', { newUser: true });
      })
      .catch((err) => {
        alert(err.request.response);
        console.log(err.request.response, 'error response');
      });
  };

  const formFields = [
    { label: 'Username', value: username, onChange: setUsername },
    { label: 'Password', value: password, onChange: setPassword },
  ];

  const submitButton = () => (
    <ButtonBase
      label="Register"
      onClick={handleSubmit}
      classes={classes.button}
    />
  );

  return (
    <FormTemplate
      title="Signup"
      subtext="Create an account to favourite and add your own recipes!"
      formFields={formFields}
      onFormSubmit={handleSubmit}
      SubmitButton={submitButton}
    />
  );
};

export default SignupForm;
