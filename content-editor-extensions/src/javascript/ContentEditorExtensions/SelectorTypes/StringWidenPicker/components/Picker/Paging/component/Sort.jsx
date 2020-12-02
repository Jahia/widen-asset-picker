import React from 'react';
import {StoreContext} from '../../../../contexts';
import {Dropdown, DropdownButton, Button} from 'react-bootstrap';
import {getRandomString} from '../../../../misc/utils';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import SearchIcon from "@material-ui/icons/Search";
import {
    IconButton,
    withStyles,
    FormControl,
    InputLabel,
    Select,
    MenuItem} from "@material-ui/core";
import SortIcon from '@material-ui/icons/Sort';
import PropTypes from "prop-types";

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

    const handleClickSortByDirection = e =>
        dispatch({
            case: 'TOGGLE_SORT_DIRECTION'
        });

    // TODO lister les options avec value et key
    // faire un dropdown button pour chaque option
    // faire le dispatch qui va bien -> update propertie and
    //     <i className="fas fa-sort-amount-up"></i>
    return (
        <li>
            <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id={`sortBy_${_id_}_label`}>Sort by</InputLabel>
                <Select
                    labelId={`sortBy_${_id_}_label`}
                    id={`sortBy_${_id_}`}
                    value={sortByItem.value}
                    onChange={handleClickSortBy}
                    label="Sort by"
                >
                    {/*<MenuItem value="">*/}
                    {/*    <em>None</em>*/}
                    {/*</MenuItem>*/}
                    {searchSortList.map((item, i) =>
                        <MenuItem key={i} value={item.value}>{item.label}</MenuItem>
                    )}
                </Select>
            </FormControl>
            <IconButton
                className={classes[sortDirectionItem.label]}
                aria-label="toggle sort order"
                onClick={handleClickSortByDirection}
            >
                <SortIcon/>
            </IconButton>
            {/*<li>*/}
            {/*    <DropdownButton*/}
            {/*        alignRight*/}
            {/*        variant="outline-dark"*/}
            {/*        title={`Sort by ${sortByItem.label}`}*/}
            {/*        id={`sortBy_${getRandomString(6, 'aA#')}`}*/}
            {/*    >*/}
            {/*        {searchSortList.map((item, i) =>*/}
            {/*            <Dropdown.Item key={i} id={item.value} onClick={handleClickSortBy}>{item.label}</Dropdown.Item>*/}
            {/*        )}*/}
            {/*        /!* <Dropdown.Divider /> *!/*/}
            {/*    </DropdownButton>*/}
            {/*</li>*/}
            {/*<li>*/}
            {/*    <Button*/}
            {/*        variant="outline-dark"*/}
            {/*        onClick={handleClickSortByDirection}*/}
            {/*    >*/}
            {/*        <FontAwesomeIcon icon={['fas', sortDirectionItem.label]}/>*/}
            {/*    </Button>*/}
            {/*</li>*/}
        </li>
    );
};

SortCmp.propTypes={
    classes: PropTypes.object.isRequired,
}

export const Sort = withStyles(styles)(SortCmp);
