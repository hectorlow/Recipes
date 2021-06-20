import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import SearchBar from 'material-ui-search-bar';
import RecipeItem from 'components/UI/RecipeItem';
import AlertSnackbar from 'components/UI/AlertSnackbar';
import './Recipes.scss';

const useStyles = makeStyles({
  filterBtn: {
    fontSize: 14,
    textTransform: 'capitalize',
    marginTop: 16,
  },
});

const Recipes = ({ location }) => {
  const classes = useStyles();
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [myRecipesFilter, setMyRecipesFilter] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_HOST_URL}/api/recipes`, {
        withCredentials: true,
      })
      .then((res) => {
        setRecipes(res.data);
        setFilteredRecipes(res.data);
      });

    // check if location, location.state exists, then check if recipeDeleted
    // property can be found in location.state before setting snackbar
    if (location && location.state && 'recipeDeleted' in location.state) {
      setOpenSnackbar(true);
    }
  }, []);

  const handleMyRecipes = () => {
    // toggle recipes filter
    setMyRecipesFilter(!myRecipesFilter);

    // if on filter, filter author's own recipes
    if (!myRecipesFilter) {
      const myRecipes = recipes.filter(
        (recipe) => recipe.author === localStorage.getItem('username')
      );
      setFilteredRecipes(myRecipes);
      return;
    }

    // if off filter, set filtered recipes to all recipes
    setFilteredRecipes(recipes);
  };

  const recipesResult = filteredRecipes.filter((recipe) => {
    // return true if search string in name of recipe
    if (recipe.name.toLowerCase().includes(search)) return true;

    const { ingredients } = recipe;
    // this for loop returns true if search string in any ingredient
    // returns false otherwse
    for (let i = 0; i < ingredients.length; i += 1) {
      if (ingredients[i].toLowerCase().includes(search)) {
        return true;
      }
    }
    return false;
  });

  return (
    <div className="Recipes">
      <AlertSnackbar
        open={openSnackbar}
        message="Recipe deleted successfully"
        onClose={() => setOpenSnackbar(false)}
      />
      <div className="Recipes__grid">
        <div className="Recipes__grid-item">
          <div className="Recipes__filter-btn-container">
            <SearchBar
              value={search}
              onChange={(newValue) => setSearch(newValue.toLowerCase())}
              onCancelSearch={() => setSearch('')}
            />
            <Button
              variant={myRecipesFilter ? 'contained' : 'outlined'}
              color="primary"
              disableElevation
              classes={{ root: classes.filterBtn }}
              onClick={() => handleMyRecipes()}
            >
              My recipes
            </Button>
          </div>
        </div>
      </div>
      <div className="Recipes__grid">
        {recipesResult.map((recipe) => (
          <div key={recipe.recipe_id} className="Recipes__grid-item">
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
