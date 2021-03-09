import React from 'react';
import {StoreContext} from '../../../contexts';
import {ResultPerPage} from './component/ResultPerPage';

import {Sort} from './component/Sort';
import {Pagination} from './component/Pagination';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core';

import Grid from '@material-ui/core/Grid';

const styles = theme => ({
    paging: {
        listStyle: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        // BackgroundColor: $facet-color-silver;
        '& > li': {
            marginRight: theme.spacing.unit
        },
        '& > li:last-child': {
            marginRight: 0
        }
    }
});

const PagingCmp = ({classes}) => {
    const {state} = React.useContext(StoreContext);
    const {
        searchResultMaxPage,
        searchResultAvailableAnswersCount
    } = state;

    // Note: think about this
    // const showForm = searchResultMaxPage > 10;

    if (!searchResultMaxPage) {
        return (<></>);
    }

    return (
        <>
            <Grid item xs={12}>
                <ul className={classes.paging}>
                    <li className="results">
                        <h6>Results : {searchResultAvailableAnswersCount}</h6>
                    </li>
                    <Sort/>
                    <ResultPerPage/>
                    {/* {showForm && */}
                    {/* <PageFormLinkJsx/>} */}
                </ul>
            </Grid>
            <Grid item xs>
                <ul className={classes.paging}>
                    <Pagination/>
                </ul>
            </Grid>
        </>

    );
};

PagingCmp.propTypes = {
    classes: PropTypes.object.isRequired
};

export const Paging = withStyles(styles)(PagingCmp);
