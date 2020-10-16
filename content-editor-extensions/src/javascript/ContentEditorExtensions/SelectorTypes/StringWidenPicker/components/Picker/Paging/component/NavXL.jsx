import React from 'react';
import {StoreContext} from '../../../../contexts';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import PageLink from './PageLink';

const NavXL = () => {
    const {state} = React.useContext(StoreContext);
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

    return (
        <>
            <PageLink index={1}/>
            {dotBefore &&
                <li className="interlayer">
                    <FontAwesomeIcon icon={['fas', 'ellipsis-h']}/>
                </li>}
            {paging.map((e, i) =>
                <PageLink key={i} index={e}/>
            )}
            {dotAfter &&
                <li className="interlayer">
                    <FontAwesomeIcon icon={['fas', 'ellipsis-h']}/>
                </li>}
            <PageLink index={searchResultMaxPage}/>
        </>

    );
};

export default NavXL;
