import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  IconButton,
} from '@material-ui/core';
import starOutline from 'images/star_checked.png';
import starFilled from 'images/star_unchecked.png';
import penangLaksa from 'images/penang_laksa.jpg';
import './RecipeItem.scss';

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

const RecipeItem = () => {
  const classes = useStyles();
  const [star, setStar] = useState(false);
  const toggleStar = () => setStar(!star);
  return (
    <Card className={classes.card}>
      <CardActionArea>
        <CardMedia className={classes.media} image={penangLaksa} />
      </CardActionArea>
      <CardContent className={classes.cardContent}>
        <div className="RecipeItem__text">
          <div>
            <span className="RecipeItem__title">Penang Laksa</span>
            <span className="RecipeItem__time-taken">30 minutes</span>
          </div>
          <div className="RecipeItem__ingredients">
            Yellow noodle, coconut milk
          </div>
          <div className="RecipeItem__author">By Singaporean</div>
        </div>
        <IconButton className={classes.iconButton} onClick={toggleStar}>
          <img
            src={star ? starFilled : starOutline}
            alt=""
            className="RecipeItem__star-icon"
          />
        </IconButton>
      </CardContent>
    </Card>
  );
};

export default RecipeItem;
