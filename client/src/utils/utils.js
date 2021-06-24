/* eslint-disable no-alert */
// this file contains global utility functions

export const redirectToLogin = (errorMsg, history) => {
  if (errorMsg === 'Token expired, login again to continue') {
    localStorage.clear();
    history.push('/login', { sessionExpired: true });
  }
};

export const amendIngredients = (ingredients) => {
  // this method removes ingredients with empty of blank names
  // and amend quantity from '' to 0 if empty
  const ingredientsArray = ingredients.filter(
    (item) => item.name !== '' || !item.name.trim()
  );

  const amendedIngredients = ingredientsArray.map((item) => {
    if (!item.quantity.length && !item.unit.length) {
      return {
        ...item,
        quantity: 0,
      };
    }
    return item;
  });
  return amendedIngredients;
};

export const removeBlankInstructions = (instructions) => {
  // this method remove empty or blank instruction
  return instructions
    .split('\n')
    .filter((item) => item.trim() && item.length > 0);
};

export const validateRecipeForm = (name, timeTaken, ingredients) => {
  // form validation for required fields
  if (!name || name === '' || !name.trim()) {
    alert('Your recipe has no name!');
    return false;
  }
  if (!timeTaken || timeTaken === '' || !timeTaken.trim()) {
    alert('Please enter time taken for recipe');
    return false;
  }
  if (
    ingredients.length === 1 &&
    (ingredients[0].name === '' || !ingredients[0].name.trim())
  ) {
    alert('Please add at least 1 ingredient');
    return false;
  }
  return true;
};
