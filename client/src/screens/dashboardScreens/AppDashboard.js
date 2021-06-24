import React, { useState } from 'react';
import {
  withRouter,
  NavLink,
  Route,
  Switch,
  useHistory,
} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton, Drawer, Button, Tooltip } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import RecipeBookIcon from 'images/recipe-book.png';
import Navbar from 'components/Navbar';
import Recipe from 'screens/dashboardScreens/Recipe';
import AddRecipe from 'screens/dashboardScreens/AddRecipe';
import Recipes from 'screens/dashboardScreens/Recipes';
import Favourites from 'screens/dashboardScreens/Favourites';
import Profile from 'screens/dashboardScreens/Profile';
import CreditsDialog from 'components/UI/CreditsDialog';
import './AppDashboard.scss';

const routes = [
  { label: 'Add new', path: '/add-recipe' },
  { label: 'Recipes', path: '/recipes' },
  { label: 'Favourites', path: '/favourites' },
  { label: 'Profile', path: '/profile' },
];

const useStyles = makeStyles({
  creditsBtn: {
    marginTop: '-8px',
    width: 48,
    alignSelf: 'center',
  },
});

const AppDashboard = () => {
  const classes = useStyles();
  const history = useHistory();
  const [openCredits, setOpenCredits] = useState(false);
  const [menu, setMenu] = useState(false);

  // set initial screen name to current route base on path name
  const [screenName, setScreenName] = useState(
    routes.find((route) => history.location.pathname.includes(route.path)).label
  );
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
      activeClassName="AppDashboard__drawer-navlink--active"
      onClick={() => closeMenuAndSetScreenName(label)}
    >
      {label}
    </NavLink>
  );

  return (
    <div className="AppDashboard">
      <div className="AppDashboard__navbar">
        <img
          src={RecipeBookIcon}
          alt=""
          className="AppDashboard__app-icon AppDashboard__app-icon--desktop"
        />
        <Navbar routes={routes} setScreenName={setScreenName} logout />
      </div>

      {/* mobile navbar */}
      <div className="AppDashboard__mobile-navbar">
        <img
          src={RecipeBookIcon}
          alt=""
          className="AppDashboard__app-icon AppDashboard__app-icon--mobile"
        />
        <div className="AppDashboard__mobile-screen-name">{screenName}</div>
        <IconButton onClick={() => setMenu(true)}>
          <MenuIcon />
        </IconButton>
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
          <Route path="/add-recipe" component={AddRecipe} />
          <Route path="/recipes" exact component={Recipes} />
          <Route path="/recipes/:recipeName" component={Recipe} />
          <Route path="/favourites" exact component={Favourites} />
          <Route path="/favourites/:recipeName" component={Recipe} />
          <Route path="/profile" component={Profile} />
        </Switch>
        <Button
          size="small"
          classes={{ root: classes.creditsBtn }}
          onClick={() => setOpenCredits(true)}
        >
          credits
        </Button>
        <CreditsDialog
          open={openCredits}
          handleClose={() => setOpenCredits(false)}
        />
      </section>
    </div>
  );
};

export default withRouter(AppDashboard);
