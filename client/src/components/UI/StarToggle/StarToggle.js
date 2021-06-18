import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import starOutline from 'images/star_checked.png';
import starFilled from 'images/star_unchecked.png';

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
        src={value ? starFilled : starOutline}
        alt=""
        className="RecipeItem__star-icon"
      />
    </IconButton>
  );
};

StarToggle.propTypes = {
  value: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default StarToggle;
