import React from 'react';
import PropTypes from 'prop-types';

import {InputAdornment, IconButton, InputBase, withStyles} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';

import {StoreContext} from '../../../contexts';

const styles = theme => ({
    root: {
        background: '#fff',
        display: 'flex',
        boxShadow: 'none',
        zIndex: 3,
        margin: '0 auto'
    },
    input: {
        flex: '100%',
        borderBottom: `1px solid ${theme.palette.primary.main}`,
        height: '50px'
    }
});

const SearchFormCmp = ({classes}) => {
    const {state, dispatch} = React.useContext(StoreContext);
    const {
        searchQuery
    } = state;

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

    return (
        <InputBase
            placeholder="Search for"
            // Variant="outlined"
            id="search-widen-media-content"
            value={searchQuery || ''}
            className={classes.input}
            endAdornment={
                <InputAdornment position="end">
                    <IconButton
                        aria-label="clear input content"
                        onClick={handleReset}
                    >
                        <ClearIcon/>
                    </IconButton>
                    <IconButton
                        aria-label="submit query"
                        color="primary"
                        onClick={handleSubmit}
                    >
                        <SearchIcon/>
                    </IconButton>
                </InputAdornment>
            }
            onChange={handleChange}
        />
    );
};

SearchFormCmp.propTypes = {
    classes: PropTypes.object.isRequired
};

export const SearchForm = withStyles(styles)(SearchFormCmp);
