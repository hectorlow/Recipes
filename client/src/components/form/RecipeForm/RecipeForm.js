import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Slider, Button } from '@material-ui/core';
import BootstrapTextField from 'components/form/BootstrapTextField';
import './RecipeForm.scss';

const useStyles = makeStyles({
  addRemoveBtn: {
    width: 90,
  },
  multiline: {
    padding: 0,
  },
});

const RecipeForm = ({ recipe, setRecipe }) => {
  const classes = useStyles();
  const { name, timeTaken, ingredients, servingSize, instructions } = recipe;

  const handleChange = (field, value) => {
    setRecipe({
      ...recipe,
      [field]: value,
    });
  };

  const renderTextField = (label, field, value, placeholder) => (
    <div key={label} className="RecipeForm__form-control">
      <div>{label}</div>
      <BootstrapTextField
        className="RecipeForm__form-text-field"
        value={value}
        onChange={(event) => handleChange(field, event.target.value)}
        placeholder={placeholder}
        required
        fullWidth
      />
    </div>
  );

  const handleIngredientChange = (value, field, id) => {
    const index = ingredients.findIndex((item) => item.id === id);
    // eslint-disable-next-line no-param-reassign
    ingredients[index][field] = value;
    handleChange('ingredients', [...ingredients]);
  };

  const renderSingleIngredient = (item) => (
    <div key={item.id} className="RecipeForm__ingredients__input-grid">
      <BootstrapTextField
        className="RecipeForm__form-text-field"
        value={item.name}
        onChange={(event) =>
          handleIngredientChange(event.target.value, 'name', item.id)
        }
        fullWidth
        placeholder="Sugar"
      />
      <div className="RecipeForm__ingredients__qty-unit">
        <BootstrapTextField
          className="RecipeForm__form-text-field"
          value={item.quantity}
          onChange={(event) =>
            handleIngredientChange(event.target.value, 'quantity', item.id)
          }
          fullWidth
          type="number"
          placeholder="2"
        />
        <BootstrapTextField
          className="RecipeForm__form-text-field"
          value={item.unit}
          onChange={(event) =>
            handleIngredientChange(event.target.value, 'unit', item.id)
          }
          fullWidth
          placeholder="tbsp"
        />
      </div>
    </div>
  );

  const handleAddIngredient = () => {
    const lastIngredientId = ingredients[ingredients.length - 1].id;
    ingredients.push({
      id: lastIngredientId + 1,
      name: '',
      quantity: '',
      unit: '',
    });
    handleChange('ingredients', [...ingredients]);
  };

  return (
    <form>
      <div className="RecipeForm__form-title">Recipe</div>
      {/* render name and time taken fields of recipe */}
      {renderTextField('Name', 'name', name)}
      {renderTextField('Time taken', 'timeTaken', timeTaken, 'E.g. 30 minutes')}

      {/* render ingredients of recipe */}
      <div className="RecipeForm__form-control">
        <div>
          Ingredients
          <span className="RecipeForm__form-helper-text">
            {' '}
            (Quantity and unit is optional)
          </span>
        </div>
        {ingredients.map((item) => renderSingleIngredient(item))}
        <div className="RecipeForm__ingredients__action-btns">
          <Button
            variant="outlined"
            classes={{ root: classes.addRemoveBtn }}
            onClick={handleAddIngredient}
          >
            Add
          </Button>
          <Button
            variant="outlined"
            classes={{ root: classes.addRemoveBtn }}
            onClick={() => {
              if (ingredients.length === 1) return;
              ingredients.pop();
              handleChange('ingredients', [...ingredients]);
            }}
          >
            Remove
          </Button>
        </div>
      </div>

      {/* render serving size and slider for recipe */}
      <div className="RecipeForm__form-control">
        <div>Serving size: {servingSize}</div>
        <div className="RecipeForm__serving-size-slider">
          <Slider
            value={servingSize}
            onChange={(event, newValue) =>
              handleChange('servingSize', newValue)
            }
            aria-labelledby="input-slider"
            min={1}
            max={10}
          />
        </div>
      </div>

      {/* render instructions of recipe under optional header */}
      <div className="RecipeForm__optional-label">Optional</div>
      <div className="RecipeForm__form-control">
        <div>
          Instructions
          <span className="RecipeForm__form-helper-text">
            {' '}
            (add each instruction on a new line)
          </span>
        </div>
        <BootstrapTextField
          className="RecipeForm__form-text-field"
          classes={{ root: classes.multiline }}
          value={instructions}
          onChange={(event) => handleChange('instructions', event.target.value)}
          multiline
          rows={3}
          fullWidth
        />
      </div>
    </form>
  );
};

RecipeForm.propTypes = {
  recipe: PropTypes.shape({
    name: PropTypes.string,
    timeTaken: PropTypes.string,
    ingredients: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        unit: PropTypes.string,
      })
    ).isRequired,
    instructions: PropTypes.string,
    servingSize: PropTypes.number,
    author: PropTypes.string,
  }).isRequired,
  setRecipe: PropTypes.func.isRequired,
};

export default RecipeForm;
