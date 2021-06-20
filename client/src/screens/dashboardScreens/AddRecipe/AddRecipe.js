import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';
import RecipeItem from 'components/UI/RecipeItem';
import ButtonBase from 'components/UI/ButtonBase';
import RecipeForm from 'components/form/RecipeForm';
import './AddRecipe.scss';

const useStyles = makeStyles({
  gridItem: {
    width: 332,
  },
  flexCenter: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  addButton: {
    fontWeight: 500,
    backgroundColor: '#FFA600',
    padding: 12,
    width: 120,
    borderRadius: 100,
  },
  multiline: {
    padding: 0,
  },
});

const AddRecipe = () => {
  const history = useHistory();
  const classes = useStyles();
  const [name, setName] = useState('');
  const [timeTaken, setTimeTaken] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [servingSize, setServingSize] = useState(1);
  const username = localStorage.getItem('username');

  const recipe = {
    name,
    time_taken: timeTaken,
    ingredients: ingredients.split('\n'),
    instructions: instructions.split('\n'),
    author: username,
  };

  const removeEmptyOrBlankInputs = (string) => {
    // This method splits string by new line and filter
    // out elements that are empty or only have whitespaces
    // Returns array
    return string.split('\n').filter((item) => item.trim() && item.length > 0);
  };

  const handleSaveNew = () => {
    axios
      .post(
        'http://localhost:5000/api/recipe',
        {
          name,
          time_taken: timeTaken,
          ingredients: removeEmptyOrBlankInputs(ingredients),
          instructions: removeEmptyOrBlankInputs(instructions),
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        history.push(`/recipes/{recipeCreated.name}`, {
          recipe: res.data,
          recipeAdded: true,
        });
      })
      .catch((error) => {
        console.log(error.request.response, 'error adding recipe');
      });
  };

  return (
    <div className="AddRecipe">
      <Paper elevation={0} className="AddRecipe__paper">
        <div className="AddRecipe__grid-container">
          <div className="AddRecipe__grid-item">
            <RecipeForm
              name={name}
              setName={setName}
              timeTaken={timeTaken}
              setTimeTaken={setTimeTaken}
              ingredients={ingredients}
              setIngredients={setIngredients}
              instructions={instructions}
              setInstructions={setInstructions}
              servingSize={servingSize}
              setServingSize={setServingSize}
            />
          </div>
          <div className="AddRecipe__grid-item">
            <RecipeItem recipe={recipe} hideStar />
          </div>
        </div>

        <div className="AddRecipe__action-buttons">
          <ButtonBase
            label="Add recipe"
            classes={classes.addButton}
            onClick={handleSaveNew}
          />
        </div>
      </Paper>
    </div>
  );
};

export default AddRecipe;
