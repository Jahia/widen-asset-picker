import React from 'react';
import {StoreContext} from "contexts";

const PageLink=({index}) =>{
    const { state, dispatch } = React.useContext(StoreContext);
    const {
        searchResultPageIndex
    } = state

    const className = searchResultPageIndex===index ? "active" : "";

    const handleGoToPage = (e) =>{
        e.preventDefault();
        dispatch({
            case: "GOTO_RESULT_PAGE",
            payload:{
                index
            }
        });
    }

    return(
        <li>
            <a href="#" className={className} onClick={handleGoToPage}>{index}</a>
        </li>
    )
}

export default PageLink;