import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const ProfileItem = props => {
  const {
    profile: {
      user: { _id, name, avatar },
      status,
      location,
      skills,
      company
    }
  } = props;

  return (
    <div className="profile bg-light">
      <img src={avatar} className="round-img" alt="avatar"></img>
      <div>
        <h2>{name}</h2>
        <p>
          {status}{" "}
          {company && (
            <span>
              at <strong>{company}</strong>
            </span>
          )}
        </p>
        <p className="m-1"> {location && (
            <span>
               <strong>{location}</strong>
            </span>
          )}</p>

          <Link to={`/profile/${_id}`} className="btn btn-primary">
              View Profile
          </Link>
      </div>
      <ul>
          {skills.slice(0,4).map((skill,index)=>(
              <li key={index} className="text-primary">
                  <i className="fas fa-check"></i>{skill}
              </li>
          ))}
          <li>
          </li>
      </ul>
    </div>
  );
};

ProfileItem.propTypes = {
  profile: PropTypes.object.isRequired
};

export default ProfileItem;
