import React, { useState } from 'react';
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
});

const AddRecipe = () => {
  const classes = useStyles();
  const [name, setName] = useState('');
  const [timeTaken, setTimeTaken] = useState('');
  const [ingredients, setIngredients] = useState('');

  const renderTextField = (label, value, handleChange) => (
    <div key={label} className="AddRecipe__form-control">
      <div>{label}</div>
      <BootstrapTextField
        className="AddRecipe__form-text-field"
        value={value}
        onChange={(event) => handleChange(event.target.value)}
        fullWidth
      />
    </div>
  );

  const handleSaveNew = () => {
    console.log('submit patch request');
  };

  return (
    <div className="AddRecipe">
      <Paper elevation={0} className="AddRecipe__paper">
        <div className="AddRecipe__grid-container">
          <div className="AddRecipe__grid-item">
            <form>
              <div className="AddRecipe__form-title">Recipe</div>
              {renderTextField('Name', name, setName)}
              {renderTextField('Time taken', timeTaken, setTimeTaken)}
              {renderTextField('Ingredients', ingredients, setIngredients)}
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
