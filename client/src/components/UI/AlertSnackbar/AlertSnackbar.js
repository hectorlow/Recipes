import React from 'react';
import PropTypes from 'prop-types';
import { Snackbar } from '@material-ui/core';

const AlertSnackbar = ({ open, onClose, message }) => {
  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={open}
      message={message}
      onClose={onClose}
      autoHideDuration={1000}
    />
  );
};

AlertSnackbar.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
};

AlertSnackbar.defaultProps = {
  open: false,
};

export default AlertSnackbar;
