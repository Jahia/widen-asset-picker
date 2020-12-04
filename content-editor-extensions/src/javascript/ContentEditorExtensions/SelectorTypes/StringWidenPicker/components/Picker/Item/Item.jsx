import React from 'react';
import PropTypes from 'prop-types';
import {StoreContext} from '../../../contexts';
import get from 'lodash.get';
import {ItemInfo} from './ItemInfo/ItemInfo';
import {withStyles} from "@material-ui/core";
import classnames from "clsx";

//const unitIndex = 12;//prev 9
const gutter = 2;


const picker={
    palette:{
        blue : '#007bff',
        white : '#fefefe',
        cardBorderColor:{
            default: 'rgba(0,0,0,.125)',//'#ccc',
            hover:'#888',
            active:'#000'
        },
        cardBackgroundColor:{
            default:'#f7f8fa'
        }
    },
}
// const styles = theme => console.log("theme.palette :",theme.palette)
const styles = theme => ({
    card:{
        lineHeight:1.5,
        backgroundColor: theme.palette.ui.omega,//picker.palette.cardBackgroundColor.default,//$card-background-color;
        marginBottom: theme.spacing.unit * gutter,
        marginRight: theme.spacing.unit * gutter,
        flexBasis: `calc( 50% - ${theme.spacing.unit * gutter * 1/2}px)`,
        boxShadow: '0 3px 3px 0 rgba(0,0,0,.05)',
        cursor: 'pointer',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        wordWrap: 'break-word',
        backgroundClip: 'border-box',
        border: `1px solid ${picker.palette.cardBorderColor.default}`,
        borderRadius: '.25rem',
        '&:hover':{
            borderColor: picker.palette.cardBorderColor.hover,//theme.palette.ui.zeta
        },
        [theme.breakpoints.up('md')]: {
            flexBasis: `calc( 33.33% - ${theme.spacing.unit * gutter * 2/3}px)`,
        },
        [theme.breakpoints.up('lg')]: {
            flexBasis: `calc( 25% - ${theme.spacing.unit * gutter * 3/4}px)`,
        }
    },
    active:{
        '& .card':{
            borderColor: picker.palette.cardBorderColor.active//theme.palette.ui.zeta
        }
    },
    wrapper:{
        backgroundColor: picker.palette.white,//theme.palette.ui.alpha,//$white,
        borderRadius: '2px'
    },

    header:{
        borderTop: `1px solid ${picker.palette.cardBorderColor.default}`,//theme.palette.ui.beta
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit}px`,
        fontSize:'1.25rem',
        textAlign:'center',
        position:'relative',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
    },
    bannerImg: {
        position: 'relative',
        height: '200px',//theme.spacing.unit * unitIndex,//200px;
        padding: `${theme.spacing.unit} 0`,//.25rem 0,
        backgroundColor:theme.palette.ui.omega,
        '& img':{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            borderRadius: '2px 2px 0 0'//.25rem .25rem 0 0;
        }
    },
    dates:{
        paddingBottom: theme.spacing.unit, //1rem;
        margin: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,//.5rem 1rem;
        fontSize: '.9rem',
        //color:  theme.palette.primary.main,//picker.palette.blue,//theme.palette.ui.gamma, //$blue,
        overflow: 'auto',
        display: 'flex',
        flexFlow: 'row wrap',

        '& div':{
            width:'50%',
            textAlign:'center',
            position:'relative',

        },
        '& strong':{
            display:'block',
            color:picker.palette.cardBorderColor.hover,//TODO voir la couleur
            fontSize:'.75rem',
            fontWeight:'700',
        }
    },
    startDate:{
        borderRight: `1px solid ${picker.palette.cardBorderColor.default}`// theme.palette.ui.beta $card-border-color;
    }

});


const ItemCmp=({item,classes})=>{
// console.log("[Item] item : ",item);
    const { state,dispatch } = React.useContext(StoreContext);
    const {mountPoint,locale,selectedItem} = state;
    const {thumbnails,created_date,last_update_date,filename,id,file_properties} = item;
    const thumbnailURL = get(thumbnails,"300px.url",null);
    // const url = get(embeds,"templated.url",null);

    //const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const options = { year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'};

    let createdDate = new Date(created_date);
    createdDate = createdDate.toLocaleDateString(locale, options);

    let updatedDate = new Date(last_update_date);
    updatedDate = updatedDate.toLocaleDateString(locale, options);

    const active = false;// TODO fix this -> selectedItem.id===id?"active":"";
    const handleClick = () =>
        dispatch({
            case:"UPDATE_SELECTED_ITEM",
            payload:{
                widenID:id
            }
        });

    return(
        <div className={classnames(
            classes.card,
            (active ? classes.active : '')
        )} onClick={handleClick}>
            <div className={classes.wrapper}>

                <div className={classes.bannerImg}>
                    <img src={thumbnailURL} alt="Image 1"/>
                </div>

                <div className={classes.header}>{filename}</div>

                <div className={classes.dates}>
                    <div className={classes.startDate}>
                        <strong>Created</strong> {createdDate}
                    </div>
                    <div>
                        <strong>Updated</strong> {updatedDate}
                    </div>
                </div>

                <ItemInfo properties={file_properties}/>

                {/*<div className="footer">*/}
                {/*    <a href="#" className="Cbtn Cbtn-primary">View</a>*/}
                {/*    <a href="#" className="Cbtn Cbtn-danger">Delete</a>*/}
                {/*</div>*/}
            </div>
        </div>
    )
}

ItemCmp.propTypes={
    item:PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
}

export const Item = withStyles(styles)(ItemCmp);