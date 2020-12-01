import React from 'react';
import {StoreContext} from '../../../../contexts';
import Pagination from '@material-ui/lab/Pagination';

const PaginationCmp = () => {
    const {state} = React.useContext(StoreContext);
    const {
        searchResultPageIndex,
        searchResultMaxPage
    } = state;

    const handleChange = (event, value) => {
        //event.preventDefault();
        dispatch({
            case: 'GOTO_RESULT_PAGE',
            payload: {
                index:value
            }
        });
    };

    return (
        <Pagination
            color="primary"
            count={searchResultMaxPage}
            page={searchResultPageIndex}
            onChange={handleChange} />
    );
};

export default Pagination;
