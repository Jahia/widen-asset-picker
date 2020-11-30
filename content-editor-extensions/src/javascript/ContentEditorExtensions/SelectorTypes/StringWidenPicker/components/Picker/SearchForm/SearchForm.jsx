import React from 'react';
import {InputGroup, Form, Button} from 'react-bootstrap';
import clsx from 'clsx';
import {FormControl, InputAdornment, InputLabel, IconButton, Input, withStyles,} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';

import {StoreContext} from '../../../contexts';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import PropTypes from "prop-types";

const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    margin: {
        margin: theme.spacing.unit,
    },
    withoutLabel: {
        marginTop: `${theme.spacing.unit * 3}`,
    },
    textField: {
        width: '25ch',
    },
});


const SearchFormCmp = ({classes}) => {
    const {state, dispatch} = React.useContext(StoreContext);
    const {
        isLoading
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

    const handleReset = e => {
        // E.preventDefault();
        dispatch({
            case: 'RESET_TEXT_QUERY'
        });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        dispatch({
            case: 'EXECUTE_QUERY'
        });
    };
    return (
        <form onSubmit={handleSubmit}>
            <FormControl className={clsx(classes.margin, classes.textField)}>
                <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
                <Input
                    id='search-widen-media-content'
                    type='text'
                    //value={searchQuery}
                    placeholder="Que cherchez-vous ?"
                    onChange={handleChange}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="clear input content"
                                onClick={handleReset}
                            >
                                <ClearIcon/>
                            </IconButton>
                        </InputAdornment>
                    }
                />
                <IconButton
                    aria-label="submit form"
                    type="submit"
                >
                    <SearchIcon/>
                </IconButton>
            </FormControl>
        </form>

    )

    // return (
    //     <Form className="pT4__form" onSubmit={handleSubmit}>
    //         <Form.Group controlId="basicSearch">
    //             {/* <Form.Label>Email address</Form.Label> */}
    //             <InputGroup className="mb-3">
    //                 <Form.Control
    //                     type="text"
    //                     name="query"
    //                     // Value={searchQuery}
    //                     placeholder="Que cherchez-vous ?"
    //                     onChange={handleChange}
    //                 />
    //                 <InputGroup.Append>
    //                     <Button type="reset" variant="outline-secondary" disabled={isLoading} onClick={handleReset}>
    //                         <FontAwesomeIcon icon={['fas', 'times']}/>
    //                     </Button>
    //                 </InputGroup.Append>
    //                 <InputGroup.Append>
    //                     <Button type="submit" variant="secondary" disabled={isLoading}>
    //                         <FontAwesomeIcon icon={['fas', 'search']}/>
    //                     </Button>
    //                 </InputGroup.Append>
    //             </InputGroup>
    //
    //             <Form.Text className="text-muted">
    //                 <FontAwesomeIcon icon={['fas', 'power-off']}/> by
    //                 Jahia For Widen
    //             </Form.Text>
    //         </Form.Group>
    //     </Form>
    // );
};

SearchFormCmp.propTypes = {
    classes: PropTypes.object.isRequired
};

export const SearchForm = withStyles(styles)(SearchFormCmp);
SearchForm.displayName = 'SearchForm';