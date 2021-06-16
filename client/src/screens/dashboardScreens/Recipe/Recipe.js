import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Paper } from '@material-ui/core';
import RecipeItem from 'components/UI/RecipeItem';
import BootstrapTextField from 'components/form/BootstrapTextField';
import FormButton from 'components/form/FormButton';
import './Recipe.scss';

const useStyles = makeStyles({
  gridItem: {
    width: 316,
  },
  flexCenter: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  editButton: {
    color: 'white',
    fontWeight: 700,
    backgroundColor: '#FFA600',
    padding: 12,
    width: 120,
    borderRadius: 100,
  },
  deleteButton: {
    color: 'white',
    fontWeight: 700,
    backgroundColor: '#5A402F',
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

  const handleEdit = () => {
    console.log('submit patch request');
  };

  const handleDelete = () => {
    console.log('submit delete request');
  };

  return (
    <div className="AddRecipe">
      <Paper elevation={0} className="AddRecipe__paper">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} className={classes.gridItem}>
            <form>
              <div className="AddRecipe__form-title">Recipe</div>
              {renderTextField('Name', name, setName)}
              {renderTextField('Time taken', timeTaken, setTimeTaken)}
              {renderTextField('Ingredients', ingredients, setIngredients)}
            </form>
          </Grid>
          <Grid item xs={12} sm={6}>
            <RecipeItem />
          </Grid>
        </Grid>

        <Grid container className="AddRecipe__action-buttons">
          <Grid item xs={6} className="AddRecipe__flex-row-center">
            <FormButton
              label="Edit"
              classes={classes.editButton}
              onClick={handleEdit}
            />
          </Grid>
          <Grid item xs={6} className="AddRecipe__flex-row-center">
            <FormButton
              label="Delete"
              classes={classes.deleteButton}
              onClick={handleDelete}
            />
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default AddRecipe;
