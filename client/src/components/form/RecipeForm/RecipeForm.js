import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Slider } from '@material-ui/core';
import BootstrapTextField from 'components/form/BootstrapTextField';
import './RecipeForm.scss';

const useStyles = makeStyles({
  multiline: {
    padding: 0,
  },
});

const RecipeForm = ({
  name,
  setName,
  timeTaken,
  setTimeTaken,
  ingredients,
  setIngredients,
  instructions,
  setInstructions,
  servingSize,
  setServingSize,
}) => {
  const classes = useStyles();

  const renderTextField = (label, value, handleChange, placeholder) => (
    <div key={label} className="RecipeForm__form-control">
      <div>{label}</div>
      <BootstrapTextField
        className="RecipeForm__form-text-field"
        value={value}
        onChange={(event) => handleChange(event.target.value)}
        placeholder={placeholder}
        required
        fullWidth
      />
    </div>
  );

  return (
    <form>
      <div className="RecipeForm__form-title">Recipe</div>
      {renderTextField('Name', name, setName)}
      {renderTextField(
        'Time taken',
        timeTaken,
        setTimeTaken,
        'E.g. 30 minutes'
      )}
      <div className="RecipeForm__form-control">
        <div>
          Ingredients
          <span className="RecipeForm__form-helper-text">
            {' '}
            (add each ingredient on a new line)
          </span>
        </div>
        <BootstrapTextField
          className="RecipeForm__form-text-field"
          classes={{ root: classes.multiline }}
          value={ingredients}
          onChange={(event) => setIngredients(event.target.value)}
          multiline
          rows={3}
          fullWidth
        />
      </div>
      <div className="RecipeForm__form-control">
        <div>
          Serving size: {servingSize}
          <span className="RecipeForm__form-helper-text">
            {' '}
            {/* (add each ingredient on a new line) */}
          </span>
        </div>
        <div className="RecipeForm__serving-size-slider">
          <Slider
            value={servingSize}
            onChange={(event, newValue) => setServingSize(newValue)}
            aria-labelledby="input-slider"
            min={1}
            max={10}
          />
        </div>
      </div>
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
          onChange={(event) => setInstructions(event.target.value)}
          multiline
          rows={3}
          fullWidth
        />
      </div>
    </form>
  );
};

RecipeForm.propTypes = {
  name: PropTypes.string.isRequired,
  setName: PropTypes.func.isRequired,
  timeTaken: PropTypes.string.isRequired,
  setTimeTaken: PropTypes.func.isRequired,
  ingredients: PropTypes.string.isRequired,
  setIngredients: PropTypes.func.isRequired,
  instructions: PropTypes.string.isRequired,
  setInstructions: PropTypes.func.isRequired,
  servingSize: PropTypes.number.isRequired,
  setServingSize: PropTypes.func.isRequired,
};

export default RecipeForm;
