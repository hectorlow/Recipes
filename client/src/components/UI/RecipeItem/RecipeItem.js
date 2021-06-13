import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
} from '@material-ui/core';
import penangLaksa from 'images/penang_laksa.jpg';

const useStyles = makeStyles({
  media: {
    height: 200,
  },
});

const RecipeItem = () => {
  const classes = useStyles();
  return (
    <Card>
      <CardActionArea>
        <CardMedia className={classes.media} image={penangLaksa} />
        <CardContent>Penang Laksa</CardContent>
      </CardActionArea>
    </Card>
  );
};

export default RecipeItem;
