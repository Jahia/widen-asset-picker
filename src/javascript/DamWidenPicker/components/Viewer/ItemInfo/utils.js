import React from "react";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import VideocamIcon from "@material-ui/icons/Videocam";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import DescriptionIcon from "@material-ui/icons/Description";

export const types = ['image','video','pdf'];

export const formatFileSize = ({sizeKB,locale}) => {
    switch (true) {
        case sizeKB > 1000000:
            return `${(sizeKB / 1000000).toLocaleString(locale, {maximumFractionDigits: 1})} GB`;
        case sizeKB > 1000:
            return `${(sizeKB / 1000).toLocaleString(locale, {maximumFractionDigits: 1})} MB`;
        default:
            return `${sizeKB.toLocaleString(locale, {maximumFractionDigits: 1})} KB`;
    }
};

export const getFileFormatIcon = (format,classes) => {
    const [_IMAGE_,_VIDEO_,_PDF_] = types;
    switch (format) {
        case _IMAGE_:
            return <PhotoCameraIcon color="primary" className={classes.vAlign}/>;
        case _VIDEO_:
            return <VideocamIcon color="primary" className={classes.vAlign}/>;
        case _PDF_:
            return <PictureAsPdfIcon color="primary" className={classes.vAlign}/>;
        default:
            return <DescriptionIcon color="primary" className={classes.vAlign}/>;
    }
};

export const formatDuration = (duration) => {
    if (duration === 'n/a') {
        return 'n/a';
    }

    const dateObj = new Date(duration * 1000);
    const hours = dateObj.getUTCHours().toString().padStart(2, '0');
    const minutes = dateObj.getUTCMinutes().toString().padStart(2, '0');
    const seconds = dateObj.getSeconds().toString().padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
};
