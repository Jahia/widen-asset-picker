import React from 'react';
import PropTypes from 'prop-types';
import {Badge} from 'react-bootstrap';
import {StoreContext} from '../../../../contexts';

const Filter = ({filter}) => {
    const {dispatch} = React.useContext(StoreContext);

    const handleClick = async e => {
        e.preventDefault();
        dispatch({
            case: 'TOGGLE_FILTER',
            payload: {
                filter
            }
        });
    };

    return (
        <li>
            {!filter.selected &&
                <a href="#" onClick={e => handleClick(e)}>
                    {filter.i18n}
                    <Badge variant="light">({filter.freq})</Badge>
                </a>}
            {filter.selected &&
                <div className="pT4-selected text-secondary">
                    {filter.i18n}
                    <Badge variant="light">({filter.freq})</Badge>
                </div>}

        </li>
    );
};

Filter.propTypes = {
    filter: PropTypes.object.isRequired
};

export default Filter;
