import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RecipeItem from 'components/UI/RecipeItem';
import './Favourites.scss';

const Favourites = () => {
  const [favouriteRecipes, setFavouriteRecipes] = useState([]);
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_HOST_URL}/api/favourites`, {
        withCredentials: true,
      })
      .then((res) => {
        setFavouriteRecipes(res.data);
      })
      .catch((err) => console.log(err.request.response, 'error getting fav'));
  }, []);

  return (
    <div className="Favourites">
      <div className="Favourites__grid">
        {favouriteRecipes.map((recipe) => {
          // const recipe = recipeObject.fav_recipe;
          return (
            <div key={recipe.recipe_id} className="Favourites__grid-item">
              <RecipeItem recipe={recipe} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Favourites;
