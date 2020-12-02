import React from 'react';
import {Card, Col, Container, Row} from 'react-bootstrap';
import {StoreContext} from '../../contexts';
import {fetchSearchData} from '../../misc/data';
import {SearchForm} from './SearchForm';
import {Paging} from './Paging';
import spinner from '../../assets/loader_4.gif';
import {Item} from './Item';
import classnames from 'clsx';
import {withStyles} from "@material-ui/core";
import Grid from '@material-ui/core/Grid';

import PropTypes from "prop-types";
import {ProgressOverlay} from "@jahia/react-material";

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
        [theme.breakpoints.only('md')]: {
            '& > div:nth-child(3n)':{
                marginRight: '0',
            }
        },
        [theme.breakpoints.up('lg')]: {
            '& > div:nth-child(4n)':{
                marginRight: '0',
            }
        }

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
    },
    spinner:{
        marginLeft: 'calc(50% - 200px)'
    },
    sticky:{
        position: 'sticky',
        top: '-24px',
        zIndex: 3,
        backgroundColor: '#fff',
        marginBottom: '10px',
        paddingBottom: '16px',
        boxShadow: '0 3px 3px 0 rgba(0,0,0,.2)',
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
//<img className="pT4__spinner" src={spinner}/>
//     <ProgressOverlay/>
    return (
        <Grid container className="pT4" spacing={3}>
            <Grid item xs={12} container className={classes.sticky}>
                <Grid item xs md={6} container>
                    <SearchForm/>
                </Grid>
                <Grid item xs>
                    <Paging/>
                </Grid>
                    {/* <CurrentFilter/> */}
            </Grid>
            <Grid item xs>

                    {isLoading &&
                    <img className={classes.spinner} src={spinner}/>
                    }
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
