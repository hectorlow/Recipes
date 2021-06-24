import React, { useState, useRef } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Button, IconButton } from '@material-ui/core';
import ImageOutlinedIcon from '@material-ui/icons/ImageOutlined';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import ButtonBase from 'components/UI/ButtonBase';
import RecipeForm from 'components/form/RecipeForm';
import RecipeItem from 'components/UI/RecipeItem';

const useStyles = makeStyles({
  uploadBtn: {
    fontSize: 14,
    textTransform: 'capitalize',
    marginTop: 8,
  },
  button: {
    fontWeight: 500,
    padding: 12,
    width: 108,
    borderRadius: 100,
  },
  removeImgBtn: {
    marginTop: '-48px',
    zIndex: 99,
    transform: 'translate(128px, 48px)',
  },
  primaryBtn: {
    backgroundColor: '#FFA600',
  },
  secondaryBtn: {
    backgroundColor: '#5A402F',
  },
});

const EditRecipe = ({
  recipe,
  setRecipe,
  handleSave,
  handleDiscard,
  newRecipe,
}) => {
  const classes = useStyles();
  const inputRef = useRef(null);
  const [displayImage, setDisplayImage] = useState(recipe.image);
  const [imageFile, setImageFile] = useState(false);

  return (
    <div>
      <div className="Recipe__grid-container">
        <div className="Recipe__grid-item">
          <RecipeForm recipe={recipe} setRecipe={setRecipe} />
        </div>
        <div className="Recipe__grid-item">
          <div className="Recipe__recipe-item">
            {displayImage && (
              <IconButton
                classes={{ root: classes.removeImgBtn }}
                onClick={() => {
                  inputRef.current.value = '';
                  setDisplayImage(false);
                  setImageFile(false);
                }}
              >
                <CloseRoundedIcon />
              </IconButton>
            )}
            <RecipeItem
              recipe={{
                ...recipe,
                time_taken: recipe.timeTaken,
                image: displayImage,
              }}
              disableClick
              hideStar
            />
            <input
              type="file"
              id="recipe-image"
              hidden
              ref={inputRef}
              onChange={(event) => {
                const file = event.target.files[0];
                setImageFile(file);
                setDisplayImage(URL.createObjectURL(file));
              }}
            />
            <Button
              type="button"
              classes={{ root: classes.uploadBtn }}
              onClick={() => {
                inputRef.current.click();
              }}
            >
              Upload image
              <ImageOutlinedIcon />
            </Button>
          </div>
        </div>
      </div>
      <div className="Recipe__action-buttons">
        <ButtonBase
          label={newRecipe ? 'Add recipe' : 'Save'}
          onClick={() => handleSave(imageFile)}
          classes={clsx(classes.button, classes.primaryBtn)}
        />
        <ButtonBase
          label={newRecipe ? 'Back' : 'Discard'}
          onClick={() => handleDiscard()}
          classes={clsx(classes.button, classes.secondaryBtn)}
        />
      </div>
    </div>
  );
};

EditRecipe.propTypes = {
  recipe: PropTypes.shape({
    timeTaken: PropTypes.string,
    image: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  }).isRequired,
  setRecipe: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  handleDiscard: PropTypes.func.isRequired,
  newRecipe: PropTypes.bool,
};

EditRecipe.defaultProps = {
  newRecipe: false,
};

export default EditRecipe;
