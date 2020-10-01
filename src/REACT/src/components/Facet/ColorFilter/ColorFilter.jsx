import React from 'react';
import PropTypes from 'prop-types';
import {StoreContext} from "contexts";

const ColorFilter=({filter})=>{

    const { dispatch } = React.useContext(StoreContext);

    const handleClick = async (e) =>{
        e.preventDefault();
        dispatch({
            case:"TOGGLE_FILTER",
            payload:{
                filter
            }
        });
    }

    return(
        <li>
            <a className={filter.name} href="#" title={filter.i18n} onClick={ e => handleClick(e) }></a>
        </li>
    )
}

ColorFilter.propTypes={
    filter:PropTypes.object.isRequired
}

export default ColorFilter;