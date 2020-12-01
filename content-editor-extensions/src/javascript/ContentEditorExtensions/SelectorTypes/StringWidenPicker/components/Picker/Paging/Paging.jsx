import React from 'react';
import {StoreContext} from '../../../contexts';
// import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
// import Nav from './component/Nav';
// import NavXL from './component/NavXL';
// import ResultPerPage from './component/ResultPerPage';
// import PageFormLink from './component/PageFormLink';
import {Sort} from './component/Sort';
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import classnames from 'clsx';

const styles = theme => ({
    paging:{
        listStyle: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        position: 'sticky',
        top: 0,
        //backgroundColor: $facet-color-silver;
    },
    // results:{
    //     '& li':{
    //         marginLeft: '1rem',
    //     },
    //     '& h6':{
    //         margin:0
    //     }
    // },

    // interlayer:{
    //     marginLeft: '-.25rem',
    //     marginRright: '.5rem',
    //     color: 'rgba(0,0,0,.125)'
    // },

    // nav:{
    //     '& a':{
    //         border:'none',
    //         margin:0
    //     },
    //     '&:last-child':{
    //         marginLeft:'-.75rem'
    //     }
    // },
    //
    // a:{
    //     padding: '.35rem .75rem',
    //     marginRight: '.75rem',
    //     border: '1px solid rgba(0,0,0,.125)',
    //     borderRadius:'3px',
    //     '&.active':{
    //         border: '1px solid $blue'
    //     }
    // },
    // formGoto: {
    //     //margin-left:1rem;
    //     '& input':{
    //         maxWidth: '3rem',
    //     }
    // }
});


const PagingCmp = ({classes}) => {
    const {state, dispatch} = React.useContext(StoreContext);
    const {
        searchResultPageIndex,
        searchResultPerPage,
        searchResultMaxPage,
        searchResultAvailableAnswersCount
    } = state;

    // TODO think about this
    const showForm = searchResultMaxPage > 10;

    if (!searchResultMaxPage) {
        return (<></>);
    }

    // const handlePrev = e => {
    //     e.preventDefault();
    //     dispatch({
    //         case: 'PREVIOUS_RESULT_PAGE'
    //     });
    // };
    //
    // const handleNext = e => {
    //     e.preventDefault();
    //     dispatch({
    //         case: 'NEXT_RESULT_PAGE'
    //     });
    // };

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
        <>
            <ul className={classes.paging}>
                <li className="results">
                    <h6>Résultats : {searchResultAvailableAnswersCount}</h6>
                </li>
                <Sort/>
                {/*<ResultPerPage/>*/}

                {/*{showForm &&*/}
                {/*<PageFormLink/>}*/}
            </ul>
            {/*<Pagination*/}
            {/*    color="primary"*/}
            {/*    count={searchResultMaxPage}*/}
            {/*    page={searchResultPageIndex}*/}
            {/*    onChange={handleChange} />*/}


            {/*<ul className="pT4__paging">*/}
            {/*    <li className="nav">*/}
            {/*        <a href="#" onClick={handlePrev}>*/}
            {/*            <FontAwesomeIcon icon={['fas', 'chevron-left']}/>*/}
            {/*        </a>*/}
            {/*    </li>*/}

            {/*    {searchResultMaxPage <= 5 &&*/}
            {/*    <Nav/>}*/}

            {/*    {searchResultMaxPage > 5 &&*/}
            {/*    <NavXL/>}*/}

            {/*    <li className="nav">*/}
            {/*        <a href="#" onClick={handleNext}>*/}
            {/*            <FontAwesomeIcon icon={['fas', 'chevron-right']}/>*/}
            {/*        </a>*/}
            {/*    </li>*/}
            {/*</ul>*/}
        </>

    );
};
PagingCmp.propTypes={
    classes: PropTypes.object.isRequired,
}

export const Paging = withStyles(styles)(PagingCmp);
