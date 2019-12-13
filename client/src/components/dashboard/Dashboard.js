import React, { useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getCurrentProfile, deleteAccount } from "../../action/profile";
import { Link } from "react-router-dom";
import Spinner from "../layout/Spinner";
import DashboardActions from "./DashboardAction";
import Experience from "./Experience";
import Education from "./Education";

const Dashboard = props => {
  const { getCurrentProfile, profile,deleteAccount } = props;
  const currentProfile = profile.profile;
  const loading = profile.loading;

  useEffect(() => {
    console.log('inside effect')
    getCurrentProfile();
  }, [getCurrentProfile]);

  return ( 
  <div className="container"> 
    { loading && currentProfile==null? <Spinner /> : <Fragment>
      <h1 className="large text-primary">Dashboard</h1>
      {currentProfile != null ? (
        <Fragment>
          <DashboardActions />
          <Experience experience={currentProfile.experience}/>
          <Education education={currentProfile.education}/>
          <div className="my-2">
            <button className="btn btn-danger" onClick={()=>deleteAccount()}><i className="fas fa-user-minus"> Delete my account</i></button>
          </div>

        </Fragment>
      ) : (
        <Fragment>
          No Profile found.{" "}
          <p>
            Please setup your profile <Link to="/create-profile">here</Link>
          </p>
        </Fragment>
      )}
    </Fragment>}
  </div>
  )
};

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  deleteAccount:PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile
});

export default connect(mapStateToProps, { getCurrentProfile,deleteAccount })(Dashboard);
