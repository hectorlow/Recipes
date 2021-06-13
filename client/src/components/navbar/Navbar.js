import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import pizzaIcon from 'images/pizza.png';
import './Navbar.scss';

const Navbar = ({ routes }) => {
  const renderNavLink = (label, to) => (
    <NavLink
      key={label}
      className="Navbar__navlink"
      activeClassName="Navbar__navlink--active"
      to={to}
    >
      <div className="Navbar__icon-container">
        <img src={pizzaIcon} alt="" className="Navbar__pizza-icon" />
      </div>
      <span>{label}</span>
    </NavLink>
  );

  return (
    <div className="Navbar__container">
      {routes.map((route) => renderNavLink(route, route.toLowerCase()))}
    </div>
  );
};

Navbar.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Navbar;
