import { withStyles, fade } from '@material-ui/core/styles';
import { InputBase } from '@material-ui/core';

const BootstrapTextField = withStyles((theme) => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.common.white,
    border: '1px solid #c4c4c4',
    fontSize: 18,
    width: '100%',
    padding: '10px 4px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:focus': {
      boxShadow: `${fade(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
      borderColor: theme.palette.primary.main,
    },
  },
}))(InputBase);

export default BootstrapTextField;
