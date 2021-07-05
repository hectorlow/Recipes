import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
} from '@material-ui/core';
import StarToggle from 'components/UI/StarToggle';
import foodTray from 'images/food-tray.png';
import './RecipeItem.scss';
import axios from 'axios';

const useStyles = makeStyles({
  card: {
    width: 300,
    height: 300,
  },
  media: {
    height: 190,
  },
  orangeBackground: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'rgb(238, 179, 113)',
  },
  noUploadText: {
    backgroundColor: '#87878733',
    textAlign: 'center',
    lineHeight: 15,
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
  },
  iconButton: {
    height: 32,
    width: 32,
  },
});

const RecipeItem = ({ recipe, disableClick, hideStar }) => {
  const classes = useStyles();
  const history = useHistory();
  const [star, setStar] = useState(recipe.favourite);

  const toggleStar = () => {
    if (!localStorage.getItem('username')) {
      // no username means user is not logged in
      setStar(!star);
      return;
    }

    axios
      .post(
        `${process.env.REACT_APP_HOST_URL}/api/favourites`,
        {
          recipe_id: recipe.recipe_id,
          favourite: !star,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        setStar(!star);
        console.log(res.data);
      })
      .catch((err) => console.log(err.request.response));
  };

  const recipeName = recipe.name;
  const timeTaken = recipe.time_taken;
  const { ingredients, author } = recipe;

  // e.g. Spicy chicken noodle becomes Spicy-chicken-noodle
  const recipeUrl = recipeName.split(' ').join('-');

  const renderIngredientsString = () => {
    let ingredientsString = ingredients.map((item) => item.name).join(', ');
    if (ingredientsString.length > 30) {
      ingredientsString = `${ingredientsString.slice(0, 30)}...`;
    }
    return ingredientsString;
  };

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
        {recipe.image ? (
          <CardMedia className={classes.media} image={recipe.image} />
        ) : (
          <CardMedia className={clsx(classes.media, classes.orangeBackground)}>
            <img src={foodTray} alt="" className="RecipeItem__food-tray" />
          </CardMedia>
        )}
      </CardActionArea>
      <CardContent className={classes.cardContent}>
        <div className="RecipeItem__header">
          <div className="RecipeItem__text">
            <span className="RecipeItem__title">{recipeName}</span>
            <span className="RecipeItem__time-taken">{timeTaken}</span>
          </div>
          {!hideStar && <StarToggle value={star} onToggle={toggleStar} />}
        </div>
        <div className="RecipeItem__ingredients">
          {renderIngredientsString()}
        </div>
        <div className="RecipeItem__author">By {author}</div>
      </CardContent>
    </Card>
  );
};

RecipeItem.propTypes = {
  recipe: PropTypes.shape({
    recipe_id: PropTypes.string,
    name: PropTypes.string.isRequired,
    time_taken: PropTypes.string.isRequired,
    ingredients: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        unit: PropTypes.string,
      })
    ).isRequired,
    author: PropTypes.string,
    image: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    favourite: PropTypes.bool,
  }),
  disableClick: PropTypes.bool,
  hideStar: PropTypes.bool,
};

RecipeItem.defaultProps = {
  recipe: {
    recipe_id: null,
    author: 'Anonymous',
    favourite: false,
  },
  disableClick: false,
  hideStar: false,
};

export default RecipeItem;
