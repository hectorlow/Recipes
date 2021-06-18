import React, { useState } from 'react';
import {
  withRouter,
  NavLink,
  Route,
  Switch,
  useHistory,
} from 'react-router-dom';
import { IconButton, Drawer } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import Navbar from 'components/Navbar';
import Recipe from 'screens/dashboardScreens/Recipe';
import AddRecipe from 'screens/dashboardScreens/AddRecipe';
import Recipes from 'screens/dashboardScreens/Recipes';
import Favourites from 'screens/dashboardScreens/Favourites';
import Profile from 'screens/dashboardScreens/Profile';
import './AppDashboard.scss';

const routes = [
  { label: 'Add new', path: '/add-recipe' },
  { label: 'Recipes', path: '/recipes' },
  { label: 'Favourites', path: '/favourites' },
  { label: 'Profile', path: '/profile' },
];

const AppDashboard = () => {
  const history = useHistory();
  const [menu, setMenu] = useState(false);
  const [screenName, setScreenName] = useState('Recipes');
  const closeMenu = () => setMenu(false);

  const closeMenuAndSetScreenName = (name) => {
    setMenu(false);
    setScreenName(name);
  };

  const renderNavLink = (label, to) => (
    <NavLink
      key={to}
      to={to}
      className="AppDashboard__drawer-navlink"
      onClick={() => closeMenuAndSetScreenName(label)}
    >
      {label}
    </NavLink>
  );

  return (
    <div className="AppDashboard">
      <div className="AppDashboard__navbar">
        <Navbar routes={routes} logout />
      </div>

      {/* mobile navbar */}
      <div className="AppDashboard__mobile-navbar">
        <IconButton onClick={() => setMenu(true)}>
          <MenuIcon />
        </IconButton>
        <div className="AppDashboard__mobile-screen-name">{screenName}</div>
      </div>
      <Drawer anchor="top" open={menu} onClose={closeMenu}>
        {routes.map((route) => renderNavLink(route.label, route.path))}
        <button
          type="button"
          className="AppDashboard__drawer-navlink AppDashboard__logout-btn"
          onClick={() => {
            // clear stored username
            localStorage.clear();
            history.push('/login');
          }}
        >
          Logout
        </button>
      </Drawer>

      <section className="AppDashboard__content">
        <Switch>
          <Route path="/recipes/:recipeName" component={Recipe} />
          <Route path="/add-recipe" component={AddRecipe} />
          <Route path="/recipes" component={Recipes} />
          <Route path="/favourites" component={Favourites} />
          <Route path="/profile" component={Profile} />
        </Switch>
      </section>
    </div>
  );
};

export default withRouter(AppDashboard);
