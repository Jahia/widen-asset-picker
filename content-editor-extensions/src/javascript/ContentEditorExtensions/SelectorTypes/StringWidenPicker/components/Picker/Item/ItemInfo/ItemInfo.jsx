import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import React from 'react';
import PropTypes from 'prop-types';
import {StoreContext} from '../../../../contexts';
import VideoInfo from './VideoInfo';
import ImageInfo from './ImageInfo';

const ItemInfo = ({properties}) => {
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
                return <FontAwesomeIcon icon={['fas','image']} size={size}/>//<FontAwesomeIcon icon={['far','file-image']} size={size}/>
            case isVideo :
                return <FontAwesomeIcon icon={['fas','video']} size={size}/>//<FontAwesomeIcon icon={['far','file-video']} size={size}/>
            case isPdf:
                return <FontAwesomeIcon icon={['far','file-pdf']} size={size}/>
            default :
                return <FontAwesomeIcon icon={['far','file']} size={size}/>
        }
    }

    return(
        <>
            <ul className="stats">
                <li className="type" title={format_type}>
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
            <ImageInfo properties={image_properties} locale={locale}/>
            }
            {isVideo &&
            <VideoInfo properties={video_properties} locale={locale}/>
            }
            {isDocument &&
            <ul className="stats">
                <li className="w-100">
                    {/*<strong></strong> <FontAwesomeIcon icon={['fas','kiwi-bird']} size="2x"/>*/}
                </li>
            </ul>
            }
        </>
    );
}

ItemInfo.propTypes={
    properties:PropTypes.object.isRequired,
}

export default ItemInfo;