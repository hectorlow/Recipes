import React from 'react';
import Navbar from 'components/Navbar';
import Recipes from 'screens/dashboardScreens/Recipes';
import './RecipesPreview.scss';

// This component is the preview of recipes for users that are not logged in
const RecipesPreview = () => (
  <div className="RecipesPreview">
    <nav className="RecipesPreview__navbar">
      <Navbar
        routes={[
          { label: 'Recipes', path: '/preview' },
          { label: 'Login', path: '/login' },
          { label: 'Signup', path: '/signup' },
        ]}
      />
    </nav>
    <section className="RecipesPreview__recipes">
      <Recipes />
    </section>
  </div>
);

export default RecipesPreview;
