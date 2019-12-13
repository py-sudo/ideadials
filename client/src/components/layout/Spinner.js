import React,{Fragment} from 'react';
import spinner from '../../img/spinner.gif'


const spinnerStyle = {
    width:'60px',
    margin:'auto',
    marginTop:'100px',
    display:'block'
}

export default () => (
    <Fragment>
        <img 
        className="spinner"
        src={spinner}
        style={spinnerStyle}
        alt="Loading"
        />
    </Fragment>
)