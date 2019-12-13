import React, { Fragment, useState } from "react";
import { Link,Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { loginAction } from "../../action/auth";
import Alert from "../layout/Alert";

const Login = props => {

  const [formData,setFormData] = useState({
    email:"",
    password:""
  })

  const onChange = e => {
    e.preventDefault();
    setFormData({
      ...formData
      ,[e.target.name]:e.target.value
    });
  };

  const { loginAction,isAuthenticated } = props;

  const onSubmit = e => {
    const {email,password} = formData;
    e.preventDefault();

    loginAction({ email, password });
  };

  //redirect if loggin

  if(isAuthenticated){
    return <Redirect to="/dashboard"></Redirect>
  }

 
  return (
    <Fragment>
      <section className="login">
      <div className="dark-overlay">
      <section className="register-login-inner">
      <Alert />
      <p className="lead">
        <i className="fas fa-user fa-3x"></i> 
      </p>
      <form className="form" action="" onSubmit={e => onSubmit(e)}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            onChange={e => onChange(e)}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            minLength="6"
            onChange={e => onChange(e)}
          />
        </div>

        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      <p className="my-1">
        Do not have an account ? <Link to="/register"> Regirster now</Link>
      </p>
      </section>
      </div>
      </section>
    </Fragment>
  );
};

Login.propTypes = {
  loginAction: PropTypes.func.isRequired,
  isAuthenticated:PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated:state.auth.isAuthenticated
})


export default connect(mapStateToProps, {loginAction})(Login);