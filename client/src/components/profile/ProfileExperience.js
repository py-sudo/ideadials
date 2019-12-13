import React from "react";
import PropTypes from "prop-types";
import Moment from "react-moment";

const ProfileExperience = props => {
  const {
    experience: { company,from, to }
  } = props;

  return (
    <div>
      <h3 className="text-dark">{company}</h3>
      <p>
        <Moment format="YYYY/MM/DD">{from}</Moment> -{" "}
        {!to ? "Current" : <Moment  format="YYYY/MM/DD">{to}</Moment>}
      </p>
    </div>
  );
};

ProfileExperience.propTypes = {
  experience: PropTypes.object.isRequired
};

export default ProfileExperience;
