import React from 'react';
import {StoreContext} from '../../../../contexts';
import {MenuItem, Select, withStyles} from "@material-ui/core";
import {getRandomString} from '../../../../misc/utils';
import PropTypes from "prop-types";

const styles = theme => ({

});

const ResultPerPageCmp = (classes) => {
    const {state, dispatch} = React.useContext(StoreContext);
    const {
        searchResultPerPage
    } = state;

    const _id_ = getRandomString(6, 'aA#');

    const handleChange = e =>
        dispatch({
            case: 'UPDATE_RESULT_PER_PAGE',
            payload: {
                value: e.target.value
            }
        });

    return (
        <li>
            <Select
                labelId={`resultPerPage_${_id_}_label`}
                id={`resultPerPage_${_id_}`}
                value={searchResultPerPage}
                onChange={handleChange}
                label="Sort by"
            >
                {[5, 10, 20, 50, 100].map(nb =>
                    <MenuItem key={nb} value={nb}>{nb}</MenuItem>
                )}
            </Select>
        </li>
    );
};
ResultPerPageCmp.propTypes={
    classes: PropTypes.object.isRequired,
}

export const ResultPerPage = withStyles(styles)(ResultPerPageCmp);
