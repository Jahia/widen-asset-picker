import React from 'react';
import PropTypes from 'prop-types';
import {StoreContext} from '../../../../contexts';
import VideoInfo from './VideoInfo';
import ImageInfo from './ImageInfo';
import {withStyles} from "@material-ui/core";
import classnames from "clsx";

import VideocamIcon from '@material-ui/icons/Videocam';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
// import OndemandVideoIcon from '@material-ui/icons/OndemandVideo';
// import CropOriginalIcon from '@material-ui/icons/CropOriginal';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import DescriptionIcon from '@material-ui/icons/Description';

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
        backgroundColor:picker.palette.cardBackgroundColor.default,//theme.palette.ui.epsilon,// $card-background-color;
        padding: `${theme.spacing.unit}px 0`,
        fontSize:'.75rem',
        color: '#59687f',
        fontWeight:'600',
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
            //fontSize:'.75rem',
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


const ItemInfoCmp = ({properties,classes}) => {
    // console.log("[ItemInfo] properties : ",properties);
    const _IMAGE_ = 'image';
    const _VIDEO_ = 'video';
    const _PDF_ = 'pdf';
    // const locale='fr-FR';

    const { state,dispatch } = React.useContext(StoreContext);
    const {locale} = state;

    const {
        format,
        format_type,
        size_in_kbytes,
        image_properties,
        video_properties
    } = properties;
    // console.log("properties : ",properties);
    // console.log("image_properties : ",image_properties);

    const isImage = format_type === _IMAGE_;
    const isVideo = format_type === _VIDEO_;
    const isDocument = !isImage && !isVideo;
    const isPdf = format_type === _PDF_;

    //TODO see if I move this outside
    const formatFileSize = () => {
        switch(true){
            case size_in_kbytes > 1000000:
                return `${(size_in_kbytes/1000000).toLocaleString(locale,{maximumFractionDigits:1})} GB`;
            case size_in_kbytes > 1000:
                return `${(size_in_kbytes/1000).toLocaleString(locale,{maximumFractionDigits:1})} MB`;
            default :
                return `${size_in_kbytes.toLocaleString(locale,{maximumFractionDigits:1})} KB`;
        }
    }

    //TODO see if I move this outside
    const getFileFormatIcon = () => {
        const size = '1x';
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
        <>
            <ul className={classes.stats}>
                <li className={classes.type} title={format_type}>
                    <strong>Type</strong>
                    {getFileFormatIcon()}
                </li>
                <li title={format.toLowerCase()}>
                    <strong>Format</strong>
                    {format.toLowerCase()}
                </li>
                <li title={formatFileSize()}>
                    <strong>Size</strong>
                    {formatFileSize()}
                </li>
            </ul>
            {isImage &&
            <ImageInfo properties={image_properties} locale={locale} classes={classes}/>
            }
            {isVideo &&
            <VideoInfo properties={video_properties} locale={locale} classes={classes}/>
            }
            {isDocument &&
            <ul className={classes.stats}>
                <li className={classes.w100}>
                    {/*<strong></strong> <FontAwesomeIcon icon={['fas','kiwi-bird']} size="2x"/>*/}
                </li>
            </ul>
            }
        </>
    );
}

ItemInfoCmp.propTypes={
    properties:PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
}

export const ItemInfo = withStyles(styles)(ItemInfoCmp);