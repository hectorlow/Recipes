import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  loginButton: {
    color: 'white',
    fontWeight: 700,
    backgroundColor: '#5A402F',
    padding: 20,
    width: 200,
    borderRadius: 100,
  },
});

const SubmitButton = ({ label, onClick }) => {
  const classes = useStyles();
  return (
    <Button
      variant="contained"
      classes={{ root: classes.loginButton }}
      disableElevation
      onClick={onClick}
    >
      {label}
    </Button>
  );
};

SubmitButton.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default SubmitButton;
