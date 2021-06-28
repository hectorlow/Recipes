/* eslint-disable max-lines */
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, IconButton, Slider } from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ButtonBase from 'components/UI/ButtonBase';
import RecipeItem from 'components/UI/RecipeItem';
import StarToggle from 'components/UI/StarToggle';
import AlertSnackbar from 'components/UI/AlertSnackbar';
import {
  redirectToLogin,
  validateRecipeForm,
  amendIngredients,
  removeBlankInstructions,
} from 'src/utils';
import EditRecipe from './EditRecipe';
import './Recipe.scss';

const useStyles = makeStyles({
  button: {
    fontWeight: 500,
    padding: 12,
    width: 108,
    borderRadius: 100,
  },
  primaryBtn: {
    backgroundColor: '#FFA600',
  },
  secondaryBtn: {
    backgroundColor: '#5A402F',
  },
});

const Recipe = ({ location }) => {
  const history = useHistory();
  const classes = useStyles();
  const { recipe, recipeAdded } = location.state;

  const username = localStorage.getItem('username');
  const [star, setStar] = useState(recipe.favourite);
  const [editMode, setEditMode] = useState(false);
  const [saveRecipeSnackbar, setSaveRecipeSnackbar] = useState(false);
  const [addRecipeSnackbar, setAddRecipeSnackbar] = useState(recipeAdded);
  const [sliderServingSize, setSliderServingSize] = useState(
    recipe.serving_size
  );

  const [curRecipe, setCurRecipe] = useState({
    recipeId: recipe.recipe_id,
    name: recipe.name,
    timeTaken: recipe.time_taken,
    ingredients: recipe.ingredients,
    servingSize: recipe.serving_size,
    instructionsArray: recipe.instructions || [],
    instructions: (recipe.instructions && recipe.instructions.join('\n')) || '',
    author: recipe.author,
    image: recipe.image,
  });
  const {
    name,
    timeTaken,
    ingredients,
    instructions,
    servingSize,
    author,
    instructionsArray,
  } = curRecipe;

  const handleToggleFavourite = () => {
    if (!username) {
      // no username means user is not logged in
      setStar(!star);
      return;
    }

    axios
      .post(
        `${process.env.REACT_APP_HOST_URL}/api/favourites`,
        {
          recipe_id: recipe.recipe_id,
          favourite: !star,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        setStar(!star);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err.request.response);
        redirectToLogin(err.request.response, history);
      });
  };

  const handleDeleteRecipe = () => {
    axios
      .delete(`${process.env.REACT_APP_HOST_URL}/api/recipe`, {
        withCredentials: true,
        data: { recipe_id: recipe.recipe_id },
      })
      .then(() => {
        history.push('/recipes', { recipeDeleted: true });
      })
      .catch((err) => {
        console.log(err.request.response);
        redirectToLogin(err.request.response, history);
      });
  };

  const renderRecipeDetails = () => {
    return (
      <div className="Recipe__grid-item">
        <div className="Recipe__title">
          <div>{name}</div>
          <StarToggle value={star} onToggle={handleToggleFavourite} />
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
            {ingredients.map((item) => (
              <li key={item.id}>
                <div className="Recipe__ingredient">
                  <span>{item.name}</span>
                  {item.quantity > 0 && (
                    <span className="Recipe__ingredient__qty-unit">
                      {/* Make ingredient quantity dynamic based on serving
                      size slider, and round up to maximum of 2 decimals */}
                      {Math.round(
                        (item.quantity * sliderServingSize * 100) / servingSize
                      ) / 100}{' '}
                      {item.unit}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>

          {/* render serving size and slider for recipe */}
          <div className="RecipeForm__form-control">
            <div>Serving size: {sliderServingSize}</div>
            <div className="RecipeForm__serving-size-slider">
              <Slider
                value={sliderServingSize}
                onChange={(event, newValue) => setSliderServingSize(newValue)}
                aria-labelledby="input-slider"
                min={1}
                max={10}
              />
            </div>
          </div>
        </div>

        <div className="Recipe__section">
          <div className="Recipe__header">Instructions</div>
          {instructions.length === 0 && (
            <div className="Recipe__no-items-list">*No listed instructions</div>
          )}
          <ol className="Recipe__list-elements">
            {instructionsArray.map((item, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <li key={index}>{item}</li>
            ))}
          </ol>
        </div>
      </div>
    );
  };

  const handleSaveChanges = (imgUpload, removeCurrentImage) => {
    if (!validateRecipeForm(name, timeTaken, ingredients)) return;

    axios
      .patch(
        `${process.env.REACT_APP_HOST_URL}/api/recipe`,
        {
          recipe_id: recipe.recipe_id,
          name,
          time_taken: timeTaken,
          ingredients: amendIngredients(ingredients),
          serving_size: servingSize,
          instructions: removeBlankInstructions(instructions) || [],
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        setEditMode(false);
        setSaveRecipeSnackbar(true);
        const savedRecipe = res.data;
        setCurRecipe({
          ...curRecipe,
          name: savedRecipe.name,
          timeTaken: savedRecipe.time_taken,
          ingredients: savedRecipe.ingredients,
          instructionsArray: savedRecipe.instructions,
          instructions: savedRecipe.instructions.join('\n'),
          servingSize: savedRecipe.serving_size,
        });
        setSliderServingSize(savedRecipe.serving_size);

        if (!imgUpload) {
          // this if block checks if there is a need to remove current image
          // if true: delete current image
          // if false: do nothing
          if (removeCurrentImage) {
            axios
              .delete(
                `${process.env.REACT_APP_HOST_URL}/api/delete-recipe-image`,
                {
                  withCredentials: true,
                  data: { recipe_id: savedRecipe.recipe_id },
                }
              )
              .then(() => {
                setCurRecipe({
                  ...curRecipe,
                  image: '',
                });
              });
          }
          return;
        }

        const formData = new FormData();
        formData.append('image', imgUpload);
        formData.append('recipe_id', savedRecipe.recipe_id);
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
            setCurRecipe({
              ...curRecipe,
              image: res2.data.image,
            });
          })
          .catch((err) => console.log(err.request.response));
      })
      .catch((err) => {
        console.log(err.request.response);
        redirectToLogin(err.request.response, history);
      });
  };

  const handleDiscardChanges = () => {
    setEditMode(false);
    setCurRecipe({
      recipeId: recipe.recipe_id,
      name: recipe.name,
      timeTaken: recipe.time_taken,
      ingredients: recipe.ingredients,
      servingSize: recipe.serving_size,
      instructionsArray: recipe.instructions,
      instructions: recipe.instructions.join('\n'),
      author: recipe.author,
      image: recipe.image,
    });
  };

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

      {!editMode ? (
        <div className="Recipe__back-btn-bar">
          <IconButton onClick={() => history.goBack()}>
            <ArrowBackIosIcon />
          </IconButton>
          <div>Back to recipes</div>
        </div>
      ) : (
        <div className="Recipe__edit-mode-padding-top" />
      )}

      <Paper elevation={0} className="Recipe__paper">
        {!editMode ? (
          <>
            <div className="Recipe__grid-container">
              {renderRecipeDetails()}

              <div className="Recipe__grid-item">
                <div className="Recipe__recipe-item">
                  <RecipeItem
                    recipe={{
                      ...curRecipe,
                      time_taken: curRecipe.timeTaken,
                    }}
                    disableClick
                    hideStar
                  />
                </div>
              </div>
            </div>

            {recipe.author === username && (
              <div className="Recipe__action-buttons">
                <ButtonBase
                  label="Edit"
                  onClick={() => {
                    setEditMode(true);
                    setCurRecipe({
                      ...curRecipe,
                      servingSize: recipe.serving_size,
                    });
                  }}
                  classes={clsx(classes.button, classes.primaryBtn)}
                />
                <ButtonBase
                  label="Delete"
                  onClick={handleDeleteRecipe}
                  classes={clsx(classes.button, classes.secondaryBtn)}
                />
              </div>
            )}
          </>
        ) : (
          <EditRecipe
            recipe={curRecipe}
            setRecipe={setCurRecipe}
            handleSave={handleSaveChanges}
            handleDiscard={handleDiscardChanges}
          />
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
        ingredients: PropTypes.arrayOf(
          PropTypes.shape({
            name: PropTypes.string,
            quantity: PropTypes.number,
            unit: PropTypes.string,
          })
        ),
        serving_size: PropTypes.number,
        instructions: PropTypes.arrayOf(PropTypes.string),
        author: PropTypes.string,
        favourite: PropTypes.bool,
        image: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
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
