import React, { Fragment, useState } from "react";

import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { setAlert } from "../../action/alert";
import { register } from "../../action/auth";
import Alert from "../layout/Alert";
import PropTypes from "prop-types";

//usestate is hook

const Register = props => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: ""
  });

  // state = {
  //   formData :{
  //     name:....
  //   }
  // }

  // this.setState()
  // setFormData

  const { name, email, password, password2 } = formData;
  const { setAlert, register, isAuthenticated } = props;
  const onChange = e =>
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  const onSubmit = async e => {
    e.preventDefault();
    if (password !== password2) {
      setAlert("password not match", "danger");
    } else {
      register({ name, email, password });
      console.log("SUCCESS");
    }
  };

  //redirect if loggin

  if (isAuthenticated) {
    return <Redirect to="/dashboard"></Redirect>;
  }

  return (
    <Fragment>
      <section className="register">
        <div className="dark-overlay">
          <section className="register-login-inner">
        <Alert />
        <p className="lead">
          <i className="fas fa-user"></i> Register
        </p>
        <form className="form" onSubmit={e => onSubmit(e)}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Enter Your Name"
              name="name"
              value={name}
              onChange={e => onChange(e)}
              required
            />
          </div>
          <div className="form-group">
          <small className="form-text">
              This site uses Gravatar so if you want a profile image, use a
              Gravatar email
            </small>
            <input
              type="email"
              placeholder="Enter Email Address"
              name="email"
              value={email}
              onChange={e => onChange(e)}
            />
            
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Enter Password"
              name="password"
              minLength="6"
              value={password}
              onChange={e => onChange(e)}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Confirm Password"
              name="password2"
              minLength="6"
              value={password2}
              onChange={e => onChange(e)}
            />
          </div>
          <input type="submit" className="btn" value="Register" />
        </form>
        <p className="my-1">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
        </section>
        </div>
      </section>
    </Fragment>
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { setAlert, register })(Register);
// bind setAlert action with props
