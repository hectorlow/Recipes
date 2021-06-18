import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import RecipeItem from 'components/UI/RecipeItem';
import AlertSnackbar from 'components/UI/AlertSnackbar';
import './Recipes.scss';

const useStyles = makeStyles({
  gridItem: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

const Recipes = ({ location }) => {
  const [recipes, setRecipes] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_HOST_URL}/api/recipes`).then((res) => {
      setRecipes(res.data);
    });

    // check if location, location.state exists, then check if recipeDeleted
    // property can be found in location.state before setting snackbar
    if (location && location.state && 'recipeDeleted' in location.state) {
      setOpenSnackbar(true);
    }
  }, []);

  const classes = useStyles();
  return (
    <div className="Recipes">
      <AlertSnackbar
        open={openSnackbar}
        message="Recipe deleted successfully"
        onClose={() => setOpenSnackbar(false)}
      />
      <div className="Recipes__grid">
        {recipes.map((recipe) => (
          <div key={recipe.recipe_id} className={classes.gridItem}>
            <RecipeItem recipe={recipe} />
          </div>
        ))}
      </div>
    </div>
  );
};

Recipes.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({}),
  }).isRequired,
};

export default Recipes;
