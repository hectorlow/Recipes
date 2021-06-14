import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import RecipeItem from 'components/UI/RecipeItem';
import './Recipes.scss';

const useStyles = makeStyles({
  gridItem: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

// breakpoints: 600, 960, 1280, 1920

const Recipes = () => {
  const classes = useStyles();
  return (
    <div className="Recipes">
      {/* <Grid container direction="row" spacing={2}>
        {[1, 2, 3, 4, 5, 6, 7].map(() => (
          <Grid item xs className={classes.gridItem}>
            <RecipeItem />
          </Grid>
        ))}
      </Grid> */}
      <div className="Recipes__grid">
        {[1, 2, 3, 4, 5, 6, 7].map((item) => (
          <div key={item.toString()} className={classes.gridItem}>
            <RecipeItem />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recipes;
