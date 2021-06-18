import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
} from '@material-ui/core';
import StarToggle from 'components/UI/StarToggle';
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

const RecipeItem = ({ recipe, disableClick, hideStar }) => {
  const classes = useStyles();
  const history = useHistory();
  const [star, setStar] = useState(false);

  const toggleStar = () => setStar(!star);

  const recipeName = recipe.name;
  const timeTaken = recipe.time_taken;
  const { ingredients, author } = recipe;

  // e.g. Spicy chicken noodle becomes Spicy-chicken-noodle
  const recipeUrl = recipeName.split(' ').join('-');

  return (
    <Card className={classes.card}>
      <CardActionArea
        onClick={() => {
          if (!disableClick) {
            const currentPath = history.location.pathname;
            history.push(`${currentPath}/${recipeUrl}`, { recipe });
          }
        }}
      >
        <CardMedia className={classes.media} image={penangLaksa} />
      </CardActionArea>
      <CardContent className={classes.cardContent}>
        <div className="RecipeItem__text">
          <div>
            <span className="RecipeItem__title">{recipeName}</span>
            <span className="RecipeItem__time-taken">{timeTaken}</span>
          </div>
          <div className="RecipeItem__ingredients">
            {ingredients.join(', ')}
          </div>
          <div className="RecipeItem__author">By {author}</div>
        </div>
        {!hideStar && <StarToggle value={star} onToggle={toggleStar} />}
      </CardContent>
    </Card>
  );
};

RecipeItem.propTypes = {
  recipe: PropTypes.shape({
    name: PropTypes.string.isRequired,
    time_taken: PropTypes.string.isRequired,
    ingredients: PropTypes.arrayOf(PropTypes.string).isRequired,
    instructions: PropTypes.arrayOf(PropTypes.string).isRequired,
    author: PropTypes.string,
  }),
  disableClick: PropTypes.bool,
  hideStar: PropTypes.bool,
};

RecipeItem.defaultProps = {
  recipe: {
    author: 'Anonymous',
  },
  disableClick: false,
  hideStar: false,
};

export default RecipeItem;
