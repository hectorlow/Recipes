import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import RecipeItem from 'components/UI/RecipeItem';
import './Recipes.scss';

const useStyles = makeStyles({
  gridItem: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

// breakpoints: 600, 960, 1280, 1920

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_HOST_URL}/api/recipes`).then((res) => {
      setRecipes(res.data);
      console.log(res.data, 'recipe res data');
    });
  }, []);

  const classes = useStyles();
  return (
    <div className="Recipes">
      <div className="Recipes__grid">
        {recipes.map((recipe) => (
          <div key={recipe.recipe_id} className={classes.gridItem}>
            <RecipeItem />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recipes;
