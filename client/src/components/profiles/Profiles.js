import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import ProfileItem from "./ProfileItem";
import { getProfiles } from "../../action/profile";

const Profiles = props => {
  const { getProfiles, profile } = props;
  const { loading, profiles } = profile;

  useEffect(() => {
    getProfiles();
  }, [getProfiles]);

  return (
    <div className="container">
    <Fragment>
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <h1 className="large text-primary">User Profiles</h1>
          <p className="lead">
            <i className="fab fa-connectdevelop"></i> Browse and connect with
            users
          </p>
          <div className="profiles">
              {profiles.length>0?(
                  profiles.map(profile=>(
                      <ProfileItem key={profile._id} profile={profile} />
                  ))
              ):(<h4>No Profile found</h4>)}
          </div>
        </Fragment>
      )}
    </Fragment>
    </div>
  );
};

Profiles.propTypes = {
  getProfiles: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile
});

export default connect(mapStateToProps, { getProfiles })(Profiles);
