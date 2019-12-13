import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

// const Alert = ({ alerts }) =>
//   alerts != null &&
//   alerts.length > 0 &&
//   alerts.map(alert => (
//     <div key={alert.id} className={`alert alert-${alert.alertType}`}>
//       {alert.msg}
//     </div>
//   ));

const Alert = ({ alerts }) => {
  if (alerts != null && alerts.length > 0) {
    return alerts.map(alert => {
      return ( <div key={alert.id} className={`alert alert-${alert.alertType}`}>
          {alert.msg}
        </div>);
    });
  }else{
    return(null);
  }
};

Alert.propTypes = {
  alerts: PropTypes.array.isRequired
};

// get state value
const mapStateToProps = state => ({
  alerts: state.alert
});

export default connect(mapStateToProps)(Alert);
