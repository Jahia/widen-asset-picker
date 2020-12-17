import React from 'react';
// import clsx from 'clsx';
import {InputAdornment, IconButton, InputBase, withStyles} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';

import {StoreContext} from '../../../contexts';
import PropTypes from "prop-types";
// import {getRandomString} from '../../../misc/utils';

const styles = theme => ({
    root: {
        background: '#fff',
        display: 'flex',
        //border: '1px solid #dfe1e5',
        boxShadow: 'none',
        //height: '44px',
        //maxWidth: '1200px',
        //width: '690px',
        //borderRadius: '24px',
        zIndex: 3,
        margin: '0 auto',
        // flexWrap: 'wrap',
    },
    input: {
        //margin: theme.spacing.unit,
        flex:'100%',
        borderBottom:`1px solid ${theme.palette.primary.main}`,
        height:'50px',
    },
});


const SearchFormCmp = ({classes}) => {
    const {state, dispatch} = React.useContext(StoreContext);
    const {
        searchQuery
    } = state;

    // const _id_ = getRandomString(6, 'aA#');

    const handleChange = e => {
        const searchQuery = e.target.value;
        // Needed if I want to enable Fuzzy search
        dispatch({
            case: 'UPDATE_TEXT_QUERY',
            payload: {
                searchQuery
            }
        });
    };

    const handleReset = () =>
        dispatch({
            case: 'RESET_TEXT_QUERY'
        });

    const handleSubmit = () =>
        dispatch({
            case: 'EXECUTE_QUERY'
        });

    //clsx(classes.margin, classes.textField)
    return (
        <InputBase
            placeholder="Search for"
            //variant="outlined"
            id="search-widen-media-content"
            value={searchQuery}
            onChange={handleChange}
            className={classes.input}
            endAdornment={<InputAdornment position="end">
                <IconButton
                    aria-label='clear input content'
                    onClick={handleReset}
                >
                    <ClearIcon/>
                </IconButton>
                <IconButton
                    aria-label="submit query"
                    color='primary'
                    onClick={handleSubmit}
                >
                    <SearchIcon/>
                </IconButton></InputAdornment>}
        />
    )
};

SearchFormCmp.propTypes = {
    classes: PropTypes.object.isRequired
};

export const SearchForm = withStyles(styles)(SearchFormCmp);
SearchForm.displayName = 'SearchForm';