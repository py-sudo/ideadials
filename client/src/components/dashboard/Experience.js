import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Moment from "react-moment";
import {deleteExperience} from '../../action/profile'
const Experience = props => {
  const { experience , deleteExperience} = props;
  console.log(experience)
  const listExperience = experience.map(exp =>(
      
  <tr key={exp._id}> 
      <td>{exp.company}</td>  
      <td className="hide-sm">{exp.title}</td>
      <td>
        <Moment format="YYYY/MM/DD">
          {exp.from}</Moment> - 
          {exp.to === null ? ("Current") : 
          ( <Moment format="YYYY/MM/DD">{exp.to}</Moment>)
          }
       
      </td>

      <td>
          <button onClick={()=>deleteExperience(exp._id)}className="btn btn-danger"><i className="fas fa-times"></i></button>
      </td>
      </tr>
      )
  );

  return (
    <Fragment>
      <h2 className="my-2">Experience Credential</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Company</th>
            <th className="hide-sm">Title</th>
            <th className="hide-sm">Years</th>
          </tr>
        </thead>

        <tbody>{listExperience}</tbody>
      </table>
    </Fragment>
  );
};

Experience.propTypes = {
    experience:PropTypes.array.isRequired,
    deleteExperience:PropTypes.func.isRequired
};

export default connect(null,{deleteExperience})(Experience);
