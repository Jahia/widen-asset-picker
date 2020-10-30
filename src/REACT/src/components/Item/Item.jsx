import React from 'react';
import PropTypes from 'prop-types';
// import {Card} from 'react-bootstrap';
import {StoreContext} from "contexts";
import get from "lodash.get";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

// const Decote=({discount,price}) => {
//
//     const { state } = React.useContext(StoreContext);
//     const {locale} = state
//
//     const [dashedPrice] = price.map( prc => Number(prc));
//     const formatedDashedPrice = new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' }).format(dashedPrice);
//
//     const [discountNumber] = discount.map( discnt => Number(discnt));
//     const formatedDiscount = new Intl.NumberFormat(locale, { style: 'percent'}).format(-Number(discountNumber)/100)
//
//
//     return(
//         <>
//             <span className="bg-danger d-block text-white font-weight-bold">{formatedDiscount}</span>
//             <del className="text-muted small mr-3">{formatedDashedPrice}</del>
//         </>
//     );
// }
//
// Decote.propTypes={
//     discount:PropTypes.array.isRequired,
//     price:PropTypes.array.isRequired
// }
const ImageStats = ({properties,locale}) => {
    // console.log("[ImageStats] properties : ",properties);
    const {width,height,aspect_ratio} = properties;
    return(
        <ul className="stats">
            <li>
                <strong>Width</strong> {width.toLocaleString(locale)} px
            </li>
            <li>
                <strong>Height</strong> {height.toLocaleString(locale)} px
            </li>
            <li>
                <strong>Ratio</strong> {aspect_ratio.toLocaleString(locale,{maximumFractionDigits:2})}
            </li>
        </ul>
    )
}

const VideoStats = ({properties,locale}) => {
    const {width,height,aspect_ratio,duration} = properties
    const formatDuration = () => {
        const dateObj = new Date(duration * 1000);
        const hours = dateObj.getUTCHours().toString().padStart(2, '0');
        const minutes = dateObj.getUTCMinutes().toString().padStart(2, '0');
        const seconds = dateObj.getSeconds().toString().padStart(2, '0');

        return `${hours}:${minutes}:${seconds}`;
    }

    return(
        <>
            <ul className="stats">
                <li title={`${width.toLocaleString(locale)} px`}>
                    <strong>Width</strong> {width.toLocaleString(locale)} px
                </li>
                <li title={`${height.toLocaleString(locale)} px`}>
                    <strong>Height</strong> {height.toLocaleString(locale)} px
                </li>
                <li>
                    <strong>Ratio</strong> {aspect_ratio && aspect_ratio.toLocaleString(locale,{maximumFractionDigits:2})}
                </li>
            </ul>
            <ul className="stats">
                <li className="w-100">
                    <strong>Duration</strong> {formatDuration()}
                </li>
            </ul>
        </>
    )
}


const ItemStats = ({properties}) => {
    // console.log("[ItemStats] properties : ",properties);
    const _IMAGE_ = 'image';
    const _VIDEO_ = 'video';
    const _PDF_ = 'pdf';
    const locale='fr-FR';

    const {
        format,
        format_type,
        size_in_kbytes,
        image_properties,
        video_properties
    } = properties;

    const isImage = format_type === _IMAGE_;
    const isVideo = format_type === _VIDEO_;
    const isDocument = !isImage && !isVideo;
    const isPdf = format_type === _PDF_;

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
                <ImageStats properties={image_properties} locale={locale}/>
            }
            {isVideo &&
                <VideoStats properties={video_properties} locale={locale}/>
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



const Item=({item})=>{
// console.log("[Item] item : ",item);
    const { state,dispatch } = React.useContext(StoreContext);
    const {selectedItem} = state //TODO locale is needed for the date format
    const {thumbnails,created_date,last_update_date,filename,id,file_properties} = item;
    const thumbnailURL = get(thumbnails,"300px.url",null);
    // const url = get(embeds,"templated.url",null);

    //const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const options = { year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'};

    let createdDate = new Date(created_date);
    createdDate = createdDate.toLocaleDateString('fr-FR', options);

    let updatedDate = new Date(last_update_date);
    updatedDate = updatedDate.toLocaleDateString('fr-FR', options);

    const active = selectedItem.id===id?"active":"";
    const handleClick = () =>
        dispatch({
            case:"UPDATE_SELECTED_ITEM",
            payload:{
                id
            }
        });


    // <Card className={active} onClick={handleClick}>
    //     {thumbnailURL &&
    //     <Card.Img variant="top" src={thumbnailURL}/>
    //     }
    //     <Card.Body>
    //         <Card.Title>{filename}</Card.Title>
    //         {/*<Card.Text>*/}
    //         {/*    {meta.description}*/}
    //         {/*</Card.Text>*/}
    //     </Card.Body>
    //     <Card.Footer className="text-center">
    //         {/*{discount &&*/}
    //         {/*    <Decote*/}
    //         {/*        discount={meta.decote}*/}
    //         {/*        price={meta.prix_barre}/>*/}
    //         {/*}*/}
    //         {date}
    //     </Card.Footer>
    // </Card>

    return(
        // <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12">
            <div className={`card tile ${active}`} onClick={handleClick}>
                <div className="wrapper">

                    <div className="banner-img">
                        <img src={thumbnailURL} alt="Image 1"/>
                    </div>

                    <div className="header">{filename}</div>

                    <div className="dates">
                        <div className="start">
                            <strong>Created</strong> {createdDate}
                        </div>
                        <div className="ends">
                            <strong>Updated</strong> {updatedDate}
                        </div>
                    </div>

                    <ItemStats properties={file_properties}/>

                    {/*<div className="footer">*/}
                    {/*    <a href="#" className="Cbtn Cbtn-primary">View</a>*/}
                    {/*    <a href="#" className="Cbtn Cbtn-danger">Delete</a>*/}
                    {/*</div>*/}
                </div>
            </div>
        // </div>

    )
}

Item.propTypes={
    item:PropTypes.object.isRequired,
}

export default Item;