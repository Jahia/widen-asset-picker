import React from 'react';
import PropTypes from 'prop-types';
import {StoreContext} from '../../../contexts';
import VideoInfo from './VideoInfo';
import ImageInfo from './ImageInfo';
import {withStyles} from "@material-ui/core";
import classnames from "clsx";
import Grid from '@material-ui/core/Grid';

import VideocamIcon from '@material-ui/icons/Videocam';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import DescriptionIcon from '@material-ui/icons/Description';
import {Typography} from "@jahia/moonstone";

// import OndemandVideoIcon from '@material-ui/icons/OndemandVideo';
// import CropOriginalIcon from '@material-ui/icons/CropOriginal';

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

const styles = theme => ({
    stats:{
        margin: 0,
        listStyle: 'none',
        display: 'flex',
        alignItems: 'stretch',
        flexFlow: 'row wrap',
        //flex-basis: calc( 33.33% - .75rem);

        borderTop: `1px solid ${picker.palette.cardBorderColor.default}`,//theme.palette.ui.beta $card-border-color
        backgroundColor:theme.palette.ui.omega,//picker.palette.cardBackgroundColor.default,// $card-background-color;
        padding: `${theme.spacing.unit}px 0`,
        fontSize:'1rem',
        color: theme.palette.primary.main,//'#59687f',
        //fontWeight:'600',
        borderRadius: '0 0 5px 5px',

        '& li':{
            borderRight: `1px solid ${picker.palette.cardBorderColor.default}`,//theme.palette.ui.beta $card-border-color
            width: '33.33333%',
            textAlign:'center',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            padding: '0 .25rem',
            // '&.w100':{
            //     width:'100%',
            //     border:'none'
            // },
        },
        '& li:nth-of-type(3)':{
            border:'none'
        },
        '& strong':{
            display:'block',
            color:picker.palette.cardBorderColor.hover,
            fontSize:'.75rem',
            fontWeight:'700',
        }
    },
    w100:{
        width:'100% !important',
        border:'none !important'
    },
    type:{
        '& strong':{
            //padding-bottom: .15rem;
        },
        '& svg':{
            fontSize:' 1.5rem'
        }
    }
})


const ItemInfoCmp = ({properties,labelledBy,classes}) => {
    // console.log("[ItemInfo] properties : ",properties);
    const _IMAGE_ = 'image';
    const _VIDEO_ = 'video';
    const _PDF_ = 'pdf';
    // const locale='fr-FR';

    const { state,dispatch } = React.useContext(StoreContext);
    const {locale} = state;

    const {
        filename,
        format,
        type,
        sizeKB,
        duration,
        aspectRatio
    } = properties;
    // console.log("properties : ",properties);
    // console.log("image_properties : ",image_properties);

    const isImage = type === _IMAGE_;
    const isVideo = type === _VIDEO_;
    const isDocument = !isImage && !isVideo;
    const isPdf = type === _PDF_;

    //TODO see if I move this outside
    const formatFileSize = () => {
        switch(true){
            case sizeKB > 1000000:
                return `${(sizeKB/1000000).toLocaleString(locale,{maximumFractionDigits:1})} GB`;
            case sizeKB > 1000:
                return `${(sizeKB/1000).toLocaleString(locale,{maximumFractionDigits:1})} MB`;
            default :
                return `${sizeKB.toLocaleString(locale,{maximumFractionDigits:1})} KB`;
        }
    }

    //TODO see if I move this outside
    const getFileFormatIcon = () => {
        switch(true){
            case isImage :
                return <PhotoCameraIcon color="primary"/>
            case isVideo :
                return <VideocamIcon color="primary"/>
            case isPdf:
                return <PictureAsPdfIcon color="primary"/>
            default :
                return <DescriptionIcon color="primary"/>
        }
    }

    return(
        <Grid container>
            <Grid item xs className={classes.type} title={type}>
                {getFileFormatIcon()}
            </Grid>
            <Grid item xs >
                <ul className={classes.stats}>
                    <li title={format.toLowerCase()}>
                        <Typography
                            data-sel-field-picker-name
                            variant="zeta"
                            color="alpha"
                            id={labelledBy}
                        >
                            {filename}
                        </Typography>
                    </li>
                    <Typography
                        data-sel-field-picker-info
                        variant="omega"
                        color="gamma"
                    >
                        {duration}
                    </Typography>
                </ul>
            </Grid>
            <Grid item xs >
                <ul className={classes.stats}>
                    <li title={format.toLowerCase()}>
                        <strong>Format</strong>
                        {format.toLowerCase()}
                    </li>
                    <li title={formatFileSize()}>
                        <strong>Size</strong>
                        {formatFileSize()}
                    </li>
                </ul>
                {!isDocument &&
                <ul className={classes.stats}>
                    <li>
                        <strong>Ratio</strong>
                        {aspectRatio && aspectRatio.toLocaleString(locale,{maximumFractionDigits:2})}
                    </li>
                </ul>
                }
                {/*{isVideo &&*/}
                {/*<VideoInfo properties={video_properties} locale={locale} classes={classes}/>*/}
                {/*}*/}
            </Grid>
        </Grid>
    );
}

ItemInfoCmp.propTypes={
    properties:PropTypes.object.isRequired,
    labelledBy:PropTypes.string.isRequired,
    classes: PropTypes.object.isRequired,
}

export const ItemInfo = withStyles(styles)(ItemInfoCmp);