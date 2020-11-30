import React from 'react';
import PropTypes from 'prop-types';
import {StoreContext} from '../../../contexts';
import get from 'lodash.get';
import ItemInfo from './ItemInfo/ItemInfo';
import {withStyles} from "@material-ui/core";
import classnames from "clsx";

const unitIndex = 12;//prev 9

const styles = theme => ({

    card:{
        backgroundColor:theme.palette.ui.epsilon,
        marginBottom: theme.spacing.unit * unitIndex,
        marginRight: theme.spacing.unit * unitIndex,
        flexBasis: `calc( 50% - ${theme.spacing.unit * unitIndex}px)`,
        boxShadow: '0 3px 3px 0 rgba(0,0,0,.05)',
        cursor: 'pointer',
        '&:hover':{
            borderColor: theme.palette.ui.zeta
        },
        //TODO
        [theme.breakpoints.up('md')]: {
            flexBasis: `calc( 50% - ${theme.spacing.unit * unitIndex}px)`,
        }
    },
    active:{
        '& .card':{
            borderColor: theme.palette.ui.zeta
        }
    },
    wrapper:{
        backgroundColor: theme.palette.ui.alpha,//$white,
        borderRadius: '2px'
    },

    header:{
        borderTop: `1px solid ${theme.palette.ui.beta}`,
        padding: `${theme.spacing.unit} ${theme.spacing.unit/2}`,
        fontSize:'1.25rem',
        textAlign:'center',
        position:'relative',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
    },
    bannerImg: {
        position: 'relative',
        height: theme.spacing.unit * unitIndex,//200px;
        padding: `${theme.spacing.unit} 0`,//.25rem 0,
        '& img':{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            borderRadius: '2px 2px 0 0'//.25rem .25rem 0 0;
        }
    },
    dates:{
        paddingBottom: theme.spacing.unit, //1rem;
        margin: `${theme.spacing.unit/2} ${theme.spacing.unit}`,//.5rem 1rem;
        fontSize: '1rem',
        color: theme.palette.ui.gamma, //$blue,
        overflow: 'auto',
        display: 'flex',
        flexFlow: 'row wrap',

        '& div':{
            width:'50%',
            textAlign:'center',
            position:'relative',

        }
    },
    startDate:{
        borderRight: `1px solid ${theme.palette.ui.beta}`// $card-border-color;
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
        // <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12">
        <div className={classnames(
            classes.card,
            //classes.tile,
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
        // </div>

    )
}

ItemCmp.propTypes={
    item:PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
}

export const Item = withStyles(styles)(ItemCmp);