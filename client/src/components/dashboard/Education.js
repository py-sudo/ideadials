import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Moment from "react-moment";
import {deleteEducation} from '../../action/profile'

const Education = props => {
  const { education ,deleteEducation } = props;

  const listEducation = education.map(edu =>(
      
  <tr key={edu._id}> 
      <td>{edu.school}</td>  
      <td className="hide-sm">{edu.degree}</td>
      <td>
        <Moment format="YYYY/MM/DD">
          {edu.from}</Moment> - 
          {edu.to === null ? ("Current") : 
          ( <Moment format="YYYY/MM/DD">{edu.to}</Moment>)
          }
       
      </td>

      <td>
          <button onClick={()=>deleteEducation(edu._id)} className="btn btn-danger"><i className="fas fa-times"></i></button>
      </td>
      </tr>
      )
  );

  return (
    <Fragment>
      <h2 className="my-2">Education Credential</h2>

      <table className="table">
        <thead>
          <tr>
            <th>School</th>
            <th className="hide-sm">Degree</th>
            <th className="hide-sm">Years</th>
          </tr>
        </thead>

        <tbody>{listEducation}</tbody>
      </table>
    </Fragment>
  );
};

Education.propTypes = {
    education:PropTypes.array.isRequired,
    deleteEducation:PropTypes.func.isRequired
};

export default connect(null,{deleteEducation})(Education);
