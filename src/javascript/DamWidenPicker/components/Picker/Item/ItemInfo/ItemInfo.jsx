import React from 'react';
import PropTypes from 'prop-types';
import {StoreContext} from '../../../../contexts';
import VideoInfo from './VideoInfo';
import ImageInfo from './ImageInfo';
import {withStyles} from '@material-ui/core';

import VideocamIcon from '@material-ui/icons/Videocam';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';

import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import DescriptionIcon from '@material-ui/icons/Description';

const picker = {
    palette: {
        blue: '#007bff',
        white: '#fefefe',
        cardBorderColor: {
            default: 'rgba(0,0,0,.125)', // '#ccc',
            hover: '#888',
            active: '#000'
        },
        cardBackgroundColor: {
            default: '#f7f8fa'
        }
    }
};

const styles = theme => ({
    stats: {
        margin: 0,
        listStyle: 'none',
        display: 'flex',
        alignItems: 'stretch',
        flexFlow: 'row wrap',
        // Flex-basis: calc( 33.33% - .75rem);

        borderTop: `1px solid ${picker.palette.cardBorderColor.default}`, // Theme.palette.ui.beta $card-border-color
        backgroundColor: theme.palette.ui.omega, // Picker.palette.cardBackgroundColor.default,// $card-background-color;
        padding: `${theme.spacing.unit}px 0`,
        fontSize: '1rem',
        color: theme.palette.primary.main, // '#59687f',
        // fontWeight:'600',
        borderRadius: '0 0 5px 5px',

        '& li': {
            borderRight: `1px solid ${picker.palette.cardBorderColor.default}`, // Theme.palette.ui.beta $card-border-color
            width: '33.33333%',
            textAlign: 'center',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            padding: '0 .25rem'
        },
        '& li:nth-of-type(3)': {
            border: 'none'
        },
        '& strong': {
            display: 'block',
            color: picker.palette.cardBorderColor.hover,
            fontSize: '.75rem',
            fontWeight: '700'
        }
    },
    w100: {
        width: '100% !important',
        border: 'none !important'
    },
    type: {
        '& strong': {
            // Padding-bottom: .15rem;
        },
        '& svg': {
            fontSize: ' 1.5rem'
        }
    }
});

const ItemInfoCmp = ({properties, classes}) => {
    const _IMAGE_ = 'image';
    const _VIDEO_ = 'video';
    const _PDF_ = 'pdf';

    const {state} = React.useContext(StoreContext);
    const {locale} = state;

    const {
        format,
        format_type: type,
        size_in_kbytes: sizeKB,
        image_properties: imageProps,
        video_properties: videoProps
    } = properties;

    const isImage = type === _IMAGE_;
    const isVideo = type === _VIDEO_;
    const isDocument = !isImage && !isVideo;
    const isPdf = type === _PDF_;

    // Note: see if I move this outside
    const formatFileSize = () => {
        switch (true) {
            case sizeKB > 1000000:
                return `${(sizeKB / 1000000).toLocaleString(locale, {maximumFractionDigits: 1})} GB`;
            case sizeKB > 1000:
                return `${(sizeKB / 1000).toLocaleString(locale, {maximumFractionDigits: 1})} MB`;
            default:
                return `${sizeKB.toLocaleString(locale, {maximumFractionDigits: 1})} KB`;
        }
    };

    // Note: see if I move this outside
    const getFileFormatIcon = () => {
        // Const size = '1x';
        switch (true) {
            case isImage:
                return <PhotoCameraIcon color="primary"/>;
            case isVideo:
                return <VideocamIcon color="primary"/>;
            case isPdf:
                return <PictureAsPdfIcon color="primary"/>;
            default:
                return <DescriptionIcon color="primary"/>;
        }
    };

    return (
        <>
            <ul className={classes.stats}>
                <li className={classes.type} title={type}>
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
            <ImageInfo properties={imageProps} locale={locale} classes={classes}/>}
            {isVideo &&
            <VideoInfo properties={videoProps} locale={locale} classes={classes}/>}
            {isDocument &&
            <ul className={classes.stats}>
                <li className={classes.w100}>
                    {/* <strong></strong> <FontAwesomeIcon icon={['fas','kiwi-bird']} size="2x"/> */}
                </li>
            </ul>}
        </>
    );
};

ItemInfoCmp.propTypes = {
    properties: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired
};

export const ItemInfo = withStyles(styles)(ItemInfoCmp);
