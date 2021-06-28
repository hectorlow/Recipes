/* eslint-disable no-alert */
import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { Paper } from '@material-ui/core';
import {
  redirectToLogin,
  validateRecipeForm,
  amendIngredients,
  removeBlankInstructions,
} from 'src/utils';
import EditRecipe from 'screens/dashboardScreens/Recipe/EditRecipe';
import './AddRecipe.scss';

const AddRecipe = () => {
  const history = useHistory();
  const username = localStorage.getItem('username');
  const [newRecipe, setNewRecipe] = useState({
    name: '',
    timeTaken: '',
    ingredients: [
      {
        id: 1,
        name: '',
        quantity: '',
        unit: '',
      },
    ],
    servingSize: 1,
    instructions: '',
    image: false,
    author: username,
  });
  const { name, timeTaken, ingredients, servingSize, instructions } = newRecipe;

  const handleNewRecipe = (imgUpload) => {
    if (!validateRecipeForm(name, timeTaken, ingredients)) return;

    axios
      .post(
        `${process.env.REACT_APP_HOST_URL}/api/recipe`,
        {
          name,
          time_taken: timeTaken,
          ingredients: amendIngredients(ingredients),
          serving_size: servingSize,
          instructions: removeBlankInstructions(instructions),
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (!imgUpload) {
          history.push(`/recipes/${name}`, {
            recipe: {
              ...res.data,
              author: username,
            },
            recipeAdded: true,
          });
          return;
        }

        const formData = new FormData();
        formData.append('image', imgUpload);
        formData.append('recipe_id', res.data.recipe_id);

        axios
          .post(
            `${process.env.REACT_APP_HOST_URL}/api/upload-recipe-image`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
              withCredentials: true,
            }
          )
          .then((res2) => {
            history.push(`/recipes/${name}`, {
              recipe: {
                ...res2.data,
                author: username,
              },
              recipeAdded: true,
            });
          })
          .catch((err) => console.log(err.request.response));
      })
      .catch((err) => {
        redirectToLogin(err.request.response, history);
        console.log(err.request.response);
      });
  };

  const handleDiscard = () => {
    history.goBack();
  };

  return (
    <div className="AddRecipe">
      <Paper elevation={0} className="AddRecipe__paper">
        <EditRecipe
          recipe={newRecipe}
          setRecipe={setNewRecipe}
          handleSave={handleNewRecipe}
          handleDiscard={handleDiscard}
          newRecipe
        />
      </Paper>
    </div>
  );
};

export default AddRecipe;
