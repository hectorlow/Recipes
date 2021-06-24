import React, { useState } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';
import ButtonBase from 'components/UI/ButtonBase';
import BootstrapTextField from 'components/form/BootstrapTextField';
import AlertSnackbar from 'components/UI/AlertSnackbar';
import { redirectToLogin } from 'src/utils';
import './Profile.scss';

const useStyles = makeStyles({
  button: {
    padding: 10,
    width: 100,
  },
  longTextBtn: {
    padding: 10,
    width: 160,
  },
});

const Profile = () => {
  const classes = useStyles();
  const [username, setUsername] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [changeUsername, setChangeUsername] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleChangeUsername = () => {
    axios
      .post(
        `${process.env.REACT_APP_HOST_URL}/api/username-change`,
        {
          username,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log(res.data);
        // Change username value in local storage, clear username variable,
        // go back to view profile screen,
        // set snackbar message and show snackbar
        localStorage.setItem('username', username);
        setChangeUsername(false);
        setUsername('');
        setSnackbarMessage('Username changed successfully');
        setOpenSnackbar(true);
      })
      .catch((err) => alert(err.request.response));
  };

  const handleChangePassword = () => {
    axios
      .post(
        `${process.env.REACT_APP_HOST_URL}/api/password-change`,
        {
          old_password: oldPassword,
          new_password: newPassword,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log(res.data);
        // go back to view profile screen, clear old and new password variables
        // set snackbar message and show snackbar
        setChangePassword(false);
        setOldPassword('');
        setNewPassword('');
        setSnackbarMessage('Password changed successfully');
        setOpenSnackbar(true);
      })
      .catch((err) => {
        redirectToLogin(err.request.response, history);
        alert(err.request.response);
      });
  };

  const renderChangeUsernameForm = () => (
    <>
      <div className="Profile__form-label">New username</div>
      <BootstrapTextField
        className="Profile__form-text-field"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        fullWidth
      />
      <section className="Profile__action-btns">
        <ButtonBase
          label="Change username"
          classes={classes.longTextBtn}
          onClick={() => handleChangeUsername(username)}
        />
        <ButtonBase
          label="Cancel"
          classes={classes.button}
          onClick={() => setChangeUsername(false)}
        />
      </section>
    </>
  );

  const renderChangePasswordForm = () => (
    <>
      <div className="Profile__form-label">Old password</div>
      <BootstrapTextField
        className="Profile__form-text-field"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
        fullWidth
      />
      <div className="Profile__form-label">New password</div>
      <BootstrapTextField
        className="Profile__form-text-field"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        fullWidth
      />
      <section className="Profile__action-btns">
        <ButtonBase
          label="Change password"
          classes={classes.longTextBtn}
          onClick={() => handleChangePassword()}
        />
        <ButtonBase
          label="Cancel"
          classes={classes.button}
          onClick={() => setChangePassword(false)}
        />
      </section>
    </>
  );

  return (
    <div className="Profile">
      <AlertSnackbar
        open={openSnackbar}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
      />
      <Paper elevation={0} className="Profile__paper">
        <div className="Profile__header">Profile</div>
        {!(changeUsername || changePassword) && (
          <>
            <div className="Profile__field-label">
              <div>Username:</div>
              <ButtonBase
                label="Edit"
                classes={classes.button}
                onClick={() => setChangeUsername(true)}
              />
            </div>
            <div className="Profile__field-value">
              {localStorage.getItem('username')}
            </div>

            <div className="Profile__field-label">
              <div>Password</div>
              <ButtonBase
                label="Change"
                classes={classes.button}
                onClick={() => setChangePassword(true)}
              />
            </div>
          </>
        )}

        {changeUsername && renderChangeUsernameForm()}
        {changePassword && renderChangePasswordForm()}
      </Paper>
    </div>
  );
};

export default Profile;
