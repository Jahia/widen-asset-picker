import React from 'react';
import {StoreContext} from '../../../contexts';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Nav from './component/Nav';
import NavXL from './component/NavXL';
import ResultPerPage from './component/ResultPerPage';
import PageFormLink from './component/PageFormLink';
import Sort from './component/Sort';

const Paging = props => {
    const {state, dispatch} = React.useContext(StoreContext);
    const {
        searchResultPerPage,
        searchResultMaxPage,
        searchResultAvailableAnswersCount
    } = state;

    // TODO think about this
    const showForm = searchResultMaxPage > 10;

    if (!searchResultMaxPage) {
        return (<></>);
    }

    const handlePrev = e => {
        e.preventDefault();
        dispatch({
            case: 'PREVIOUS_RESULT_PAGE'
        });
    };

    const handleNext = e => {
        e.preventDefault();
        dispatch({
            case: 'NEXT_RESULT_PAGE'
        });
    };

    return (
        <>
            <ul className="pT4__paging results">
                <li className="results">
                    {/* <FontAwesomeIcon icon={['fas','hashtag']}/> */}
                    <h6>Résultats : {searchResultAvailableAnswersCount}</h6>
                </li>
                <Sort/>
                <ResultPerPage/>

                {showForm &&
                <PageFormLink/>}
            </ul>
            <ul className="pT4__paging">
                <li className="nav">
                    <a href="#" onClick={handlePrev}>
                        <FontAwesomeIcon icon={['fas', 'chevron-left']}/>
                    </a>
                </li>

                {searchResultMaxPage <= 5 &&
                <Nav/>}

                {searchResultMaxPage > 5 &&
                <NavXL/>}

                <li className="nav">
                    <a href="#" onClick={handleNext}>
                        <FontAwesomeIcon icon={['fas', 'chevron-right']}/>
                    </a>
                </li>
            </ul>
        </>

    );
};

export default Paging;
