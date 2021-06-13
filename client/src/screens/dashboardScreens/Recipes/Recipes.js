import React from 'react';
import { Grid } from '@material-ui/core';
import RecipeItem from 'components/UI/RecipeItem';
import './Recipes.scss';

const Recipes = () => {
  return (
    <div className="Recipes">
      <Grid container direction="row" spacing={2}>
        {[1, 2, 3, 4, 5, 6, 7].map(() => (
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <RecipeItem />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Recipes;
