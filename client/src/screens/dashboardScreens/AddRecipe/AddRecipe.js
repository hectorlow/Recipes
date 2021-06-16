import React, { useState } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';
import RecipeItem from 'components/UI/RecipeItem';
import BootstrapTextField from 'components/form/BootstrapTextField';
import FormButton from 'components/form/FormButton';
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
    color: 'white',
    fontWeight: 700,
    backgroundColor: '#FFC457',
    padding: 12,
    width: 120,
    borderRadius: 100,
  },
  multiline: {
    padding: 0,
  },
});

const AddRecipe = () => {
  const classes = useStyles();
  const [name, setName] = useState('');
  const [timeTaken, setTimeTaken] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');

  const renderTextField = (label, value, handleChange, placeholder) => (
    <div key={label} className="AddRecipe__form-control">
      <div>{label}</div>
      <BootstrapTextField
        className="AddRecipe__form-text-field"
        value={value}
        onChange={(event) => handleChange(event.target.value)}
        placeholder={placeholder}
        fullWidth
      />
    </div>
  );

  const handleSaveNew = () => {
    console.log(instructions, 'instructions');
    return;
    axios
      .post(
        'http://localhost:5000/api/recipe',
        {
          name,
          time_taken: timeTaken,
          ingredients,
          instructions,
        },
        {
          headers: {
            Authorization:
              'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2l' +
              'kIjoiYzJjNWM5MTktMTRmNi00MmI2LWFkYzYtMTlhOWZlY2ZhMjA1IiwiZXh' +
              'wIjoxNjIzNjg5MzkxfQ.zgE7xsKIN3GFRmsIjWHw0P0KxHZreIIdDy0_mpnBYzk',
          },
        }
      )
      .then((response) => {
        console.log(response.data, 'Recipe added');
      })
      .catch((error) => {
        console.log(error, 'what is happening');
        console.log(error.request.response, 'error adding recipe');
      });
  };

  return (
    <div className="AddRecipe">
      <Paper elevation={0} className="AddRecipe__paper">
        <div className="AddRecipe__grid-container">
          <div className="AddRecipe__grid-item">
            <form>
              <div className="AddRecipe__form-title">Recipe</div>
              {renderTextField('Name', name, setName)}
              {renderTextField(
                'Time taken',
                timeTaken,
                setTimeTaken,
                'E.g. 30 minutes'
              )}
              <div className="AddRecipe__form-control">
                <div>
                  Ingredients
                  <span className="AddRecipe__form-helper-text">
                    {' '}
                    (add each ingredient on a new line)
                  </span>
                </div>
                <BootstrapTextField
                  className="AddRecipe__form-text-field"
                  classes={{ root: classes.multiline }}
                  value={ingredients}
                  onChange={(event) => setIngredients(event.target.value)}
                  multiline
                  rows={3}
                  fullWidth
                />
              </div>
              <div className="AddRecipe__optional-label">Optional</div>
              <div className="AddRecipe__form-control">
                <div>
                  Instructions
                  <span className="AddRecipe__form-helper-text">
                    {' '}
                    (add each instruction on a new line)
                  </span>
                </div>
                <BootstrapTextField
                  className="AddRecipe__form-text-field"
                  classes={{ root: classes.multiline }}
                  value={instructions}
                  onChange={(event) => setInstructions(event.target.value)}
                  multiline
                  rows={3}
                  fullWidth
                />
              </div>
            </form>
          </div>
          <div className="AddRecipe__grid-item">
            <RecipeItem />
          </div>
        </div>

        <div className="AddRecipe__action-buttons">
          <FormButton
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
