import React from 'react';
import {InputGroup, Form, Button} from 'react-bootstrap';
import clsx from 'clsx';
import {FormControl, InputAdornment, InputLabel, IconButton, InputBase, withStyles,TextField} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';

import {StoreContext} from '../../../contexts';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import PropTypes from "prop-types";
import {getRandomString} from '../../../misc/utils';

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
    margin: {
        margin: theme.spacing.unit,
    },
    // withoutLabel: {
    //     marginTop: `${theme.spacing.unit * 3}`,
    // },
    textField: {
        flex:'100%',
        borderBottom:'1px solid',
    },
    // searchBtn:{
    //     height: '44px',
    //     width: '44px',
    //     background: 'transparent',
    //     border: 'none',
    //     cursor: 'pointer',
    //     flex: '0 0 auto',
    //     padding: 0,
    //     paddingRight: `${theme.spacing.unit}px`,
    // }
});


const SearchFormCmp = ({classes}) => {
    const {state, dispatch} = React.useContext(StoreContext);
    const {
        isLoading
    } = state;

    const _id_ = getRandomString(6, 'aA#');

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
    // <form id={_id_} onSubmit={handleSubmit} className={classes.root}>
    return (
        <InputBase
            placeholder="Browse Widen"
            //variant="outlined"
            id="search-widen-media-content"
            onChange={handleChange}
            className={clsx(classes.margin, classes.textField)}
            // startAdornment={<InputAdornment position="start">
            //     <IconButton
            //         aria-label="clear input content"
            //         onClick={handleReset}
            //     >
            //         <ClearIcon/>
            //     </IconButton></InputAdornment>}
            endAdornment={<InputAdornment position="end">
                <IconButton
                    aria-label="clear input content"
                    onClick={handleReset}
                >
                    <ClearIcon/>
                </IconButton>
                <IconButton
                    aria-label="submit query"
                    onClick={handleSubmit}
                >
                    <SearchIcon/>
                </IconButton></InputAdornment>}
        />
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