import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import RecipeItem from 'components/UI/RecipeItem';
import { redirectToLogin } from 'src/utils';
import StarToggle from 'components/UI/StarToggle';
import './Favourites.scss';

const Favourites = () => {
  const history = useHistory();
  const [favouriteRecipes, setFavouriteRecipes] = useState([]);
  const [star, setStar] = useState(true);
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_HOST_URL}/api/favourites`, {
        withCredentials: true,
      })
      .then((res) => {
        setFavouriteRecipes(res.data);
        console.log(res.data, 'favourites');
      })
      .catch((err) => {
        console.log(err.request.response, 'error getting fav');
        redirectToLogin(err.request.response, history);
      });
  }, []);

  return (
    <div className="Favourites">
      <div className="Favourites__grid">
        {favouriteRecipes.length === 0 && (
          <div className="Favourites__no-fav-text">
            <div>No favourites added!</div>
            <StarToggle value={star} onToggle={() => setStar(!star)} />
          </div>
        )}
        {favouriteRecipes.map((recipe) => {
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
