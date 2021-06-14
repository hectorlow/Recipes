import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  NavLink,
  Route,
  Switch,
} from 'react-router-dom';
import { Hidden, IconButton, Drawer } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import Navbar from 'components/Navbar';
import AddRecipe from 'screens/dashboardScreens/AddRecipe';
import Recipes from 'screens/dashboardScreens/Recipes';
import Favourites from 'screens/dashboardScreens/Favourites';
import Profile from 'screens/dashboardScreens/Profile';
import './AppDashboard.scss';

const AppDashboard = () => {
  const [menu, setMenu] = useState(false);
  const [screenName, setScreenName] = useState('Recipes');

  const closeMenu = () => setMenu(false);

  const closeMenuAndSetScreenName = (name) => {
    setMenu(false);
    setScreenName(name);
  };

  const renderNavLink = (label, to) => (
    <NavLink
      to={to}
      className="AppDashboard__drawer-navlink"
      onClick={() => closeMenuAndSetScreenName(label)}
    >
      {label}
    </NavLink>
  );

  return (
    <Router>
      <div className="AppDashboard">
        <Hidden xsDown>
          <div className="AppDashboard__navbar">
            <Navbar
              routes={[
                { label: 'Add new', path: '/add-recipe' },
                { label: 'Recipes', path: '/recipes' },
                { label: 'Favourites', path: '/favourites' },
                { label: 'Profile', path: '/profile' },
                { label: 'Logout', path: '/logout' },
              ]}
            />
          </div>
        </Hidden>

        {/* mobile navbar */}
        <Hidden smUp>
          <div className="AppDashboard__mobile-navbar">
            <IconButton onClick={() => setMenu(true)}>
              <MenuIcon />
            </IconButton>
            <div className="AppDashboard__mobile-screen-name">{screenName}</div>
          </div>
          <Drawer anchor="top" open={menu} onClose={closeMenu}>
            {renderNavLink('Recipes', '/recipes')}
            {renderNavLink('Favourites', '/favourites')}
            {renderNavLink('Profile', '/profile')}
            {renderNavLink('Logout', '/logout')}
          </Drawer>
        </Hidden>

        <section className="AppDashboard__content">
          <Switch>
            <Route path="/add-recipe" component={AddRecipe} />
            <Route path="/recipes" component={Recipes} />
            <Route path="/favourites" component={Favourites} />
            <Route path="/profile" component={Profile} />
          </Switch>
        </section>
      </div>
    </Router>
  );
};

export default AppDashboard;
