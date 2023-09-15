import React from 'react';
import PropTypes from 'prop-types';

export const ErrorHandler = ({item, errors}) => {
    if(errors){
        return(
            <div>
                <h1>Validation errors</h1>
                <p>An error occurred when validating <b>{item}</b></p>
                <ul>
                    {errors.map( error =>{
                        const additionalProperty = error.params?.additionalProperty;
                        return  <li key={`${error.keyword}_${additionalProperty}`}>
                            {error.message}<b>{additionalProperty ? `: ${additionalProperty}`:""}</b>
                        </li>})
                    }
                </ul>
            </div>
        )
    }else{
        return(
            <div>
                <h1>Error</h1>
                <p>An error occurred: <b>{item}</b></p>
            </div>
        )
    }
};

ErrorHandler.propTypes = {
    item: PropTypes.string.isRequired,
    errors: PropTypes.array.isRequired
};
