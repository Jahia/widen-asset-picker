import React from 'react';
import {StoreContext} from '../../../../contexts';
import PropTypes from 'prop-types';
import {withStyles, IconButton} from '@material-ui/core';
import {PageLink} from './component/PageLink';

import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

const styles = () => ({
    root: {
        listStyle: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end'
        // BackgroundColor: $facet-color-silver;
    },
    ellipsis: {
        fontSize: '.875rem'
    }
});

const PaginationCmp = ({classes}) => {
    const {state, dispatch} = React.useContext(StoreContext);
    const {
        searchResultPageIndex,
        searchResultMaxPage
    } = state;

    const dotBefore = searchResultPageIndex > 3;
    const dotAfter = searchResultMaxPage - searchResultPageIndex > 2;

    let paging;
    switch (true) {
        case searchResultPageIndex <= 2:
            paging = [2, 3];
            break;
        case searchResultMaxPage - searchResultPageIndex > 1:
            paging = [searchResultPageIndex - 1, searchResultPageIndex, searchResultPageIndex + 1];
            break;
        case searchResultMaxPage - searchResultPageIndex === 1:
            paging = [searchResultPageIndex - 1, searchResultPageIndex];
            break;
        default:
            paging = [searchResultPageIndex - 2, searchResultPageIndex - 1];
            break;
    }

    const handlePrev = () =>
        dispatch({
            case: 'PREVIOUS_RESULT_PAGE'
        });

    const handleNext = () =>
        dispatch({
            case: 'NEXT_RESULT_PAGE'
        });

    return (
        <li>
            <nav>
                <ul className={classes.root}>
                    <li>
                        <IconButton aria-label="previous page" onClick={handlePrev}>
                            <ChevronLeftIcon/>
                        </IconButton>
                    </li>

                    {searchResultMaxPage <= 5 &&
                    <>
                        {[...Array(searchResultMaxPage)].map((e, i) =>
                            <PageLink key={i} index={i + 1}/>
                        )}
                    </>}

                    {searchResultMaxPage > 5 &&
                    <>
                        <PageLink index={1}/>

                        {dotBefore &&
                            // Interlayer
                        <li className={classes.ellipsis}>
                            <MoreHorizIcon/>
                        </li>}
                        {paging.map(e =>
                            <PageLink key={e} index={e}/>
                        )}
                        {dotAfter &&
                        <li className={classes.ellipsis}>
                            <MoreHorizIcon/>
                        </li>}

                        <PageLink index={searchResultMaxPage}/>
                    </>}
                    <li>
                        <IconButton aria-label="next page" onClick={handleNext}>
                            <ChevronRightIcon/>
                        </IconButton>
                    </li>

                </ul>
            </nav>
        </li>
    );
};

PaginationCmp.propTypes = {
    classes: PropTypes.object.isRequired
};

export const Pagination = withStyles(styles)(PaginationCmp);
