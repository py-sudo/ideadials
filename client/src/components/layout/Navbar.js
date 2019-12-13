import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logout } from "../../action/auth";

const Navbar = props => {
  const {
    auth: { isAuthenticated, loading, user },
    logout
  } = props;

  const authLinks = (
    <ul>
      <li>
        <Link to="/profiles">User Profiles</Link>
      </li>
      <li>
        <Link to="/posts">
          <span className="hide-sm">Posts</span>{" "}
        </Link>
      </li>

      <li>
        <div className="nav-dropdown">
          <span className="hide-sm"> {user && user.name} </span>
          <i className="fa fa-caret-down"></i>

          <div className="dropdown-content">
            <div>
              <Link to="/dashboard">
                <span className="hide-sm">Dashboard</span>{" "}
              </Link>
            </div>
            <a href="#" onClick={logout}>
              <span className="hide-sm">Logout</span>{" "}
            </a>
          </div>
        </div>
      </li>
    </ul>
  );

  const guestLinks = (
    <ul>
      <li>
        <Link to="/profiles">User Profiles</Link>
      </li>
      <li>
        <Link to="/register">Register</Link>
      </li>
      <li>
        <Link to="/login">Login</Link>
      </li>
    </ul>
  );

  return (
    <nav className="navbar bg-dark">
      <h1>
        <Link to="/">
          <i className="far fa-lightbulb"></i> IdeaDials
        </Link>
      </h1>
      {!loading && (
        <Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
      )}
    </nav>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(mapStateToProps, { logout })(Navbar);
