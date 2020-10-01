import React from 'react';
import PropTypes from "prop-types";

const Ajv = ({item,errors})=> {
    return(
        <div>
            <h1>Validation errors</h1>
            <p>An error occurred when validating <b>{item}</b></p>
            <ul>
                {errors.map( (error,i) =>
                    <li>
                        {error.dataPath} : {error.message}
                    </li>)
                }
            </ul>
        </div>
    )
}

Ajv.propTypes={
    item:PropTypes.string.isRequired,
    errors:PropTypes.array.isRequired
};

export default Ajv;