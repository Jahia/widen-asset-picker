import React from 'react';
import PropTypes from "prop-types";
import {StoreContext} from '../../../../contexts';
import {getRandomString} from '../../../../misc/utils';
import SortIcon from '@material-ui/icons/Sort';
import {
    IconButton,
    withStyles,
    Select,
    MenuItem} from "@material-ui/core";


const styles = theme => ({
    sortUp:{
        transform : 'scaleY(-1)'
    }
});

const SortCmp = ({classes}) => {
    const {state, dispatch} = React.useContext(StoreContext);
    const {
        searchSortBy,
        searchSortByDirection,
        searchSortList,
        searchSortListDirection
    } = state;
    const [sortByItem] = searchSortList.filter(item => item.value === searchSortBy);
    const [sortDirectionItem] = searchSortListDirection.filter(item => item.value === searchSortByDirection);

    const _id_ = getRandomString(6, 'aA#');

    const handleClickSortBy = e => {
        const sortBy = e.target.value;
        dispatch({
            case: 'UPDATE_SORT_ITEM',
            payload: {
                sortBy
            }
        });
    };

    const handleClickSortByDirection = () =>
        dispatch({
            case: 'TOGGLE_SORT_DIRECTION'
        });

    return (
        <>
        <li>
            <Select
                labelId={`sortBy_${_id_}_label`}
                id={`sortBy_${_id_}`}
                value={sortByItem.value}
                onChange={handleClickSortBy}
                label="Sort by"
            >
                {/*<MenuItem value=""><em>None</em></MenuItem>*/}

                {searchSortList.map((item, i) =>
                    <MenuItem key={i} value={item.value}>{item.label}</MenuItem>
                )}
            </Select>
        </li>
        <li>
            <IconButton
                className={classes[sortDirectionItem.label]}
                aria-label="toggle sort order"
                onClick={handleClickSortByDirection}
            >
                <SortIcon/>
            </IconButton>
        </li>
            </>
    );
};

SortCmp.propTypes={
    classes: PropTypes.object.isRequired,
}

export const Sort = withStyles(styles)(SortCmp);
