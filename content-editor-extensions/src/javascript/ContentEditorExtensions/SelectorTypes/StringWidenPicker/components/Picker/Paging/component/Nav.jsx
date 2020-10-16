import React from 'react';
import {StoreContext} from '../../../../contexts';
import PageLink from './PageLink';

const Nav = () => {
    const {state} = React.useContext(StoreContext);
    const {
        searchResultMaxPage
    } = state;

    return (
        <>
            {[...Array(searchResultMaxPage)].map((e, i) =>
                <PageLink key={i} index={i + 1}/>
            )}
        </>

    );
};

export default Nav;
