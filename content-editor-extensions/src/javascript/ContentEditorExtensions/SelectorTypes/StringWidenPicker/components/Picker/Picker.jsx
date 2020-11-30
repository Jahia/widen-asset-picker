import React from 'react';
import {Card, Col, Container, Row} from 'react-bootstrap';
import {StoreContext} from '../../contexts';
import {fetchSearchData} from '../../misc/data';
import {SearchForm} from './SearchForm';
import Paging from './Paging';
import spinner from '../../assets/loader_4.gif';
import {Item} from './Item';
import classnames from 'clsx';
import {withStyles} from "@material-ui/core";
import Grid from '@material-ui/core/Grid';

import PropTypes from "prop-types";

const errorMsg = 'Oups something get wrong';
const Error = ({e}) => {
    return (
        <>
            <h1>{errorMsg}</h1>
            <p>{e.message}</p>
        </>
    );
};

const styles = theme => ({
    wdenResult:{
        display: 'flex',
        alignItems: 'stretch',
        flexFlow: 'row wrap',
    },
    '@keyframes fadeInOpacity': {
        '0%': {
            opacity: 0
        },
        '100%': {
            opacity: 1
        }
    },
    fadeIn: {
        opacity: 1,
        animationName: 'fadeInOpacity',
        animationIterationCount: 1,
        animationTimingFunction: 'ease-in',
        animationDuration: '.5s'
    }
});


const PickerCmp = ({classes}) => {
    const {state, dispatch} = React.useContext(StoreContext);
    const {
        error,
        isLoading,
        searchAnswers,
        needToFetch
    } = state;

    React.useEffect(() => {
        // Console.log("[APP] needToFetch : ",needToFetch);

        const _fetchData = async () =>
            await fetchSearchData({
                path: '/assets/search',
                state,
                dispatch
            });

        if (needToFetch) {
            _fetchData();
        }
    }, [needToFetch]);

    if (error) {
        return <Error e={error}/>;
    }

    return (
        <Grid container className="pT4" spacing={3}>
            <Grid item xs={12}>
                    <Paging/>    <SearchForm/>
                    {/* <CurrentFilter/> */}
            </Grid>
            <Grid item xs={12}>

                    {isLoading &&
                    <img className="pT4__spinner" src={spinner}/>}
                    {!isLoading &&
                    <div className={classnames(
                        classes.wdenResult,
                        (isLoading ? '' : classes.fadeIn)
                    )}>
                        {
                            searchAnswers.map(item => (
                                <Item
                                    key={item.id}
                                    item={item}
                                    locale={state.locale}
                                />
                              )
                            )
                        }
                    </div>
                        // SearchIframe &&
                        // <iframe frameBorder="0" src={searchIframe} width="100%" height="700px"></iframe>
                    }
                {/*<Col xs="4" sm="3" md="4" lg="3">*/}
                {/*    /!* <ul className="pT4__facet"> *!/*/}
                {/*    /!*    {searchFacets.map( facet => *!/*/}
                {/*    /!*        <Facet *!/*/}
                {/*    /!*            key={facet.id} *!/*/}
                {/*    /!*            facet={facet} *!/*/}
                {/*    /!*        /> *!/*/}
                {/*    /!*    ) *!/*/}
                {/*    /!*    } *!/*/}
                {/*    /!* </ul> *!/*/}
                {/*</Col>*/}
            </Grid>
        </Grid>
    );
};

PickerCmp.propTypes = {
    classes: PropTypes.object.isRequired,
}

export const Picker = withStyles(styles)(PickerCmp);;
