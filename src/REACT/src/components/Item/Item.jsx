import React from 'react';
import PropTypes from 'prop-types';
// import {Card} from 'react-bootstrap';
import {StoreContext} from "contexts";
import get from "lodash.get";

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
const ImageStats = properties => {
    console.log("[ImageStats] properties : ",properties);
    const {width,height,aspect_ratio} = properties
    return(
        <div className="stats">
            <div>
                <strong>Width</strong> {width.toFixed(0)}
            </div>
            <div>
                <strong>Height</strong> {height.toFixed(0)}
            </div>
            <div>
                <strong>Ratio</strong> {aspect_ratio.toFixed(2)}
            </div>
        </div>
    )
}

const VideoStats = properties => {
    const {width,height,aspect_ratio,duration} = properties
    return(
        <>
            <div className="stats">
                <div>
                    <strong>Width</strong> {width.toFixed(0)}
                </div>
                <div>
                    <strong>Height</strong> {height.toFixed(0)}
                </div>
                <div>
                    <strong>Ratio</strong> {aspect_ratio.toFixed(2)}
                </div>
            </div>
            <div className="stats">
                <div>
                    <strong>Duration</strong> {duration.toFixed(0)}s
                </div>
            </div>
        </>
    )
}


const ItemStats = properties => {
    console.log("[ItemStats] properties : ",properties);
    const _IMAGE_ = 'image';
    const _VIDEO_ = 'video';

    const {format,format_type,size_in_kbytes,image_properties,video_properties} = properties;

    const isImage = format_type === _IMAGE_;
    const isVideo = format_type === _VIDEO_;

    console.log("[ItemStats] format_type : ",format_type);
    console.log("[ItemStats] isImage : ",isImage);
    console.log("[ItemStats] isVideo : ",isVideo);

    return(
        <>
            <div className="stats">
                <div>
                    <strong>Type</strong> {format_type}
                </div>
                <div>
                    <strong>Format</strong> {format}
                </div>
                <div>
                    <strong>Size</strong> {size_in_kbytes} kB
                </div>
            </div>
            {isImage &&
                <ImageStats properties={image_properties}/>
            }
            {isVideo &&
                <VideoStats properties={video_properties}/>
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
        <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12">
            <div className={`tile ${active}`} onClick={handleClick}>
                <div className="wrapper">
                    <div className="header">{filename}</div>
                    <div className="banner-img">
                        <img src={thumbnailURL} alt="Image 1"/>
                    </div>
                    <div className="dates">
                        <div className="start">
                            <strong>Created</strong> {createdDate}
                            <span></span>
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
        </div>

    )
}

Item.propTypes={
    item:PropTypes.object.isRequired,
}

export default Item;