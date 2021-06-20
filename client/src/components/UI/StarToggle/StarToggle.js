import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import starChecked from 'images/star_checked.png';
import starUnchecked from 'images/star_unchecked.png';

const useStyles = makeStyles({
  card: {
    width: 300,
    height: 300,
  },
  media: {
    height: 190,
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'row',
  },
  iconButton: {
    height: 32,
    width: 32,
  },
});

const StarToggle = ({ value, onToggle }) => {
  const classes = useStyles();
  return (
    <IconButton className={classes.iconButton} onClick={onToggle}>
      <img
        src={value ? starChecked : starUnchecked}
        alt=""
        className="RecipeItem__star-icon"
      />
    </IconButton>
  );
};

StarToggle.propTypes = {
  value: PropTypes.bool,
  onToggle: PropTypes.func.isRequired,
};

StarToggle.defaultProps = {
  value: false,
}

export default StarToggle;
