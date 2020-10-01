import React from 'react';
// import PropTypes from 'prop-types';
import {Badge, Button} from 'react-bootstrap';
import {StoreContext} from "contexts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const CurrentFilter=(props)=>{

    const { state,dispatch } = React.useContext(StoreContext);
    const {
        searchFilters
    } = state

    if(searchFilters.length === 0)
        return <></>

    const handleRemoveFilter = (filter) =>{
        dispatch({
            case: "REMOVE_FILTER",
            payload: {
                filter
            }
        });
    };

    return(
        <ul className="pT4__filter">
            <li>
                <Badge className="badge-highlight" variant="primary">
                    <FontAwesomeIcon icon={['fas','user-check']}/>
                </Badge>
            </li>
            {searchFilters.map(filter =>
                <li key={filter.id}>
                    <Button variant="outline-primary" onClick={()=> handleRemoveFilter(filter)}>
                        {filter.name}<br/>
                        <small className="text-dark font-weight-bold">
                            {filter.value_i18n}
                        </small>
                        <Badge variant="light">
                            <FontAwesomeIcon className="" icon={['fas','times']}/>
                        </Badge>
                    </Button>
                </li>
            )}
        </ul>
    )
}

CurrentFilter.propTypes={}

export default CurrentFilter;