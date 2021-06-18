import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { NavLink, useHistory } from 'react-router-dom';
import pizzaIcon from 'images/pizza.png';
import './Navbar.scss';

const Navbar = ({ routes, logout }) => {
  const history = useHistory();

  const sendLogoutRequest = () => {
    axios
      .post(
        `${process.env.REACT_APP_HOST_URL}/api/logout`,
        {},
        {
          withCredentials: true,
        }
      )
      .then(() => {
        localStorage.clear();
        history.push('/login');
      })
      .catch((err) => console.log(err.request.response, 'error logging out'));
  };

  const renderNavLink = (label, path) => (
    <NavLink
      key={label}
      className="Navbar__navlink"
      activeClassName="Navbar__navlink--active"
      to={path}
    >
      <div className="Navbar__icon-container">
        <img src={pizzaIcon} alt="" className="Navbar__pizza-icon" />
      </div>
      <span>{label}</span>
    </NavLink>
  );

  return (
    <div className="Navbar__container">
      {routes.map((route) => renderNavLink(route.label, route.path))}
      {logout && (
        <button
          type="button"
          className="Navbar__logout-button Navbar__navlink"
          onClick={() => sendLogoutRequest()}
        >
          Logout
        </button>
      )}
    </div>
  );
};

Navbar.propTypes = {
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      path: PropTypes.string,
    })
  ).isRequired,
  logout: PropTypes.bool,
};

Navbar.defaultProps = {
  logout: false,
};

export default Navbar;
