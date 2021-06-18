import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles({
  button: {
    color: 'white',
    fontFamily: 'Roboto, san serif',
    textTransform: 'capitalize',
    fontWeight: 500,
    borderRadius: 100,
  },
});

const ButtonBase = ({ label, onClick, classes }) => {
  const baseClass = useStyles();
  return (
    <Button
      variant="contained"
      classes={{ root: clsx(baseClass.button, classes) }}
      disableElevation
      onClick={onClick}
    >
      {label}
    </Button>
  );
};

ButtonBase.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  classes: PropTypes.string,
};

ButtonBase.defaultProps = {
  classes: '',
};

export default ButtonBase;
