import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';

const FormButton = ({ label, onClick, classes }) => {
  return (
    <Button
      variant="contained"
      classes={{ root: classes }}
      disableElevation
      onClick={onClick}
    >
      {label}
    </Button>
  );
};

FormButton.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  classes: PropTypes.string,
};

FormButton.defaultProps = {
  classes: {},
};

export default FormButton;
