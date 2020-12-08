import React from 'react';
import PropTypes from 'prop-types';
import {StoreContext} from '../../../contexts';
import VideoInfo from './VideoInfo';
import ImageInfo from './ImageInfo';
import {withStyles} from "@material-ui/core";

import VideocamIcon from '@material-ui/icons/Videocam';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import DescriptionIcon from '@material-ui/icons/Description';
import {Typography} from "@jahia/moonstone";



const styles = theme => ({
    vAlign:{
        verticalAlign:'middle',
    }
})


const ItemInfoCmp = ({properties,classes}) => {
    // console.log("[ItemInfo] properties : ",properties);
    const _IMAGE_ = 'image';
    const _VIDEO_ = 'video';
    const _PDF_ = 'pdf';
    // const locale='fr-FR';

    const { state } = React.useContext(StoreContext);
    const {locale} = state;

    const {
        format,
        type,
        sizeKB,
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
                return <PhotoCameraIcon className={classes.vAlign}/>
            case isVideo :
                return <VideocamIcon className={classes.vAlign}/>
            case isPdf:
                return <PictureAsPdfIcon className={classes.vAlign}/>
            default :
                return <DescriptionIcon className={classes.vAlign}/>
        }
    }

    return(
        <Typography
            data-sel-field-picker-info
            variant="omega"
            color="gamma"
        >
            {getFileFormatIcon()} | {format.toLowerCase()} | {formatFileSize()}
            {isImage && <ImageInfo locale={locale} properties={properties}/>}
            {isVideo && <VideoInfo locale={locale} properties={properties}/>}
        </Typography>
    );
}

ItemInfoCmp.propTypes={
    properties:PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
}

export const ItemInfo = withStyles(styles)(ItemInfoCmp);