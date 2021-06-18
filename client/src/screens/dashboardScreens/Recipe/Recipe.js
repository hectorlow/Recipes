import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, IconButton } from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import RecipeForm from 'components/form/RecipeForm';
import ButtonBase from 'components/UI/ButtonBase';
import RecipeItem from 'components/UI/RecipeItem';
import StarToggle from 'components/UI/StarToggle';
import AlertSnackbar from 'components/UI/AlertSnackbar';
import './Recipe.scss';

const useStyles = makeStyles({
  button: {
    fontWeight: 500,
    padding: 12,
    width: 108,
    borderRadius: 100,
  },
  editBtn: {
    backgroundColor: '#FFA600',
  },
  deleteBtn: {
    backgroundColor: '#5A402F',
  },
});

const Recipe = ({ location }) => {
  const history = useHistory();
  const classes = useStyles();
  const { recipe, recipeAdded } = location.state;
  const username = localStorage.getItem('username');
  const [star, setStar] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [saveRecipeSnackbar, setSaveRecipeSnackbar] = useState(false);
  const [addRecipeSnackbar, setAddRecipeSnackbar] = useState(recipeAdded);

  const [name, setName] = useState(recipe.name);
  const [timeTaken, setTimeTaken] = useState(recipe.time_taken);
  const [ingredients, setIngredients] = useState(recipe.ingredients.join('\n'));
  const [instructions, setInstructions] = useState(
    recipe.instructions.join('\n')
  );
  const { author } = recipe;

  const handleToggle = () => {
    // TODO send axios request to set as favourite also
    setStar(!star);
  };

  // View recipe button functions
  const handleEdit = () => setEditMode(true);

  const handleDelete = () => {
    axios
      .delete(`${process.env.REACT_APP_HOST_URL}/api/recipe`, {
        withCredentials: true,
        data: { recipe_id: recipe.recipe_id },
      })
      .then(() => {
        history.push('/recipes', { recipeDeleted: true });
      })
      .catch((err) => console.log(err.request.response));
  };

  const removeEmptyOrBlankInputs = (string) => {
    // This method splits string by new line and filter
    // out elements that are empty or only have whitespaces
    // Returns array
    return string.split('\n').filter((item) => item.trim() && item.length > 0);
  };

  // Edit recipe button functions
  const handleSave = () => {
    const editedRecipe = {
      recipe_id: recipe.recipe_id,
      name,
      time_taken: timeTaken,
      ingredients: removeEmptyOrBlankInputs(ingredients),
      instructions: removeEmptyOrBlankInputs(instructions),
    };
    axios
      .patch(`${process.env.REACT_APP_HOST_URL}/api/recipe`, editedRecipe, {
        withCredentials: true,
      })
      .then(() => {
        setEditMode(false);
        setSaveRecipeSnackbar(true);
      })
      .catch((err) => console.log(err.request.response, 'patch request error'));
  };

  const handleDiscard = () => setEditMode(false);

  // view and edit recipe render functions
  const renderRecipeViewMode = () => (
    <div className="Recipe__grid-item">
      <div className="Recipe__title">
        <div>{name}</div>
        <StarToggle value={star} onToggle={handleToggle} />
      </div>

      <section className="Recipe__author-and-time-taken">
        <div className="Recipe__author">By {author}</div>
        <div className="Recipe__time-taken">{timeTaken}</div>
      </section>

      <div className="Recipe__section">
        <div className="Recipe__header">Ingredients</div>
        {recipe.ingredients.length === 0 && (
          <div className="Recipe__no-items-list">*No listed ingredients</div>
        )}
        <ul className="Recipe__list-elements">
          {recipe.ingredients.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="Recipe__section">
        <div className="Recipe__header">Instructions</div>
        {recipe.instructions.length === 0 && (
          <div className="Recipe__no-items-list">*No listed instructions</div>
        )}
        <ol className="Recipe__list-elements">
          {recipe.instructions.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </div>
    </div>
  );

  const renderRecipeEditMode = () => (
    <div className="Recipe__grid-item">
      <RecipeForm
        name={name}
        setName={setName}
        timeTaken={timeTaken}
        setTimeTaken={setTimeTaken}
        ingredients={ingredients}
        setIngredients={setIngredients}
        instructions={instructions}
        setInstructions={setInstructions}
      />
    </div>
  );

  return (
    <div className="Recipe">
      <AlertSnackbar
        open={saveRecipeSnackbar}
        message="Saved successfully"
        onClose={() => setSaveRecipeSnackbar(false)}
      />
      <AlertSnackbar
        open={addRecipeSnackbar}
        message="Recipe added successfully"
        onClose={() => setAddRecipeSnackbar(false)}
      />
      <div className="Recipe__back-btn-bar">
        <IconButton onClick={() => history.goBack()}>
          <ArrowBackIosIcon />
        </IconButton>
        <div>Back to recipes</div>
      </div>
      <Paper elevation={0} className="Recipe__paper">
        <div className="Recipe__grid-container">
          {editMode ? renderRecipeEditMode() : renderRecipeViewMode()}

          <div className="Recipe__grid-item">
            <RecipeItem recipe={recipe} disableClick hideStar />
          </div>
        </div>

        {editMode && (
          <div className="Recipe__action-buttons">
            <ButtonBase
              label="Save"
              onClick={handleSave}
              classes={clsx(classes.button, classes.editBtn)}
            />
            <ButtonBase
              label="Discard"
              onClick={handleDiscard}
              classes={clsx(classes.button, classes.deleteBtn)}
            />
          </div>
        )}

        {recipe.author === username && !editMode && (
          <div className="Recipe__action-buttons">
            <ButtonBase
              label="Edit"
              onClick={handleEdit}
              classes={clsx(classes.button, classes.editBtn)}
            />
            <ButtonBase
              label="Delete"
              onClick={handleDelete}
              classes={clsx(classes.button, classes.deleteBtn)}
            />
          </div>
        )}
      </Paper>
    </div>
  );
};

Recipe.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({
      recipe: PropTypes.shape({
        recipe_id: PropTypes.string,
        name: PropTypes.string,
        time_taken: PropTypes.string,
        ingredients: PropTypes.arrayOf(PropTypes.string),
        instructions: PropTypes.arrayOf(PropTypes.string),
        author: PropTypes.string,
      }).isRequired,
      recipeAdded: PropTypes.bool,
    }),
  }),
};

Recipe.defaultProps = {
  location: {
    state: {
      recipeAdded: false,
    },
  },
};

export default Recipe;
