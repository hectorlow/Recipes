import React from 'react';
import { NavLink } from 'react-router-dom';
import './GuestNavbar.scss';

const NavbarGuest = () => {
  const renderNavLink = (label, to) => (
    <NavLink
      className="NavbarGuest__navlink"
      activeClassName="NavbarGuest__navlink--active"
      to={to}
    >
      {label}
    </NavLink>
  );

  return (
    <span className="NavbarGuest__container">
      {renderNavLink('Recipes', '/recipes')}
      {renderNavLink('Login', '/login')}
      {renderNavLink('Signup', '/signup')}
    </span>
  );
};

export default NavbarGuest;
