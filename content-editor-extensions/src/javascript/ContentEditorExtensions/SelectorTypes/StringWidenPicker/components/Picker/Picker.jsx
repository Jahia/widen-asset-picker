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
import NotInterestedIcon from '@material-ui/icons/NotInterested';

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
        [theme.breakpoints.between('xs','sm')]: {
            '& > div:nth-child(2n)':{
                marginRight: '0',
            }
        },
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
    '@keyframes rotateScaleDownHor':{
        '0%': {
            transform: 'scale(1) rotateX(0)',
        },
        '50%': {
            transform: 'scale(0.5) rotateX(-180deg)',
        },
        '100%': {
            transform: 'scale(1) rotateX(-360deg)',
        }
    },
    rotateScaleDownHor: {
        animation: 'rotateScaleDownHor 3s linear 3s 1 both',
    },
    spinner:{
        marginLeft: 'calc(50% - 250px)'
    },
    // progressiveOverlay:{
    //     marginTop: 'calc(50% - 50px)'
    // },
    sticky:{
        position: 'sticky',
        top: 0,//'-24px',//if no dialog header
        zIndex: 3,
        backgroundColor: '#fff',
        marginBottom: '10px',
        paddingBottom: '16px',
        boxShadow: '0px 10px 13px -13px #000000, 2px 5px 15px 5px rgba(0,0,0,0);'
    },
    noResult:{
        width: '100%',
        paddingTop: '150px',
        textAlign: 'center',
        fontSize:'32px',
        textTransform:'uppercase',
        '& span':{
            display:'block',
        },
        animation: 'rotateScaleDownHor 5s linear 5s 1 both',
    },
    fontSizeLarge:{
        fontSize:'132px',
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
        <Grid container spacing={3}>
            <Grid item xs={12} container className={classes.sticky}>
                <Grid item sm={12} md={6} container>
                    <SearchForm/>
                </Grid>
                <Grid item xs container>
                    <Paging/>
                </Grid>
                    {/* <CurrentFilter/> */}
            </Grid>
            <Grid item xs>

                    {isLoading &&
                    // <div className={classes.progressiveOverlay}>
                    //     <ProgressOverlay/>
                    // </div>
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
                        {searchAnswers.length===0 &&
                            <div className={classes.noResult}>
                                <NotInterestedIcon
                                    color="primary"
                                    fontSize="large"
                                    classes={{fontSizeLarge:classes.fontSizeLarge}}
                                />
                                <span>No result found</span>
                            </div>

                        }
                    </div>
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
