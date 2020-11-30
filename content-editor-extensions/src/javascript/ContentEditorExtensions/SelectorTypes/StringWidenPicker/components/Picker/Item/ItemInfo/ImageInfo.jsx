import React from "react";
import PropTypes from "prop-types";

const ImageInfo = ({properties,locale}) => {
    // console.log("[ImageStats] properties : ",properties);

    //reduce is used to manage case {width = null} for svg image for example
    //default value works only for undefined
    const {
        width,
        height,
        aspect_ratio
    } = Object.keys(properties).reduce((reducer,key) => {
        reducer[key]= properties[key] || 'n/a';
        return reducer;
    },{});


// console.log("ImageStats width : ",width);
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

ImageInfo.propTypes={
    properties:PropTypes.object.isRequired,
    locale:PropTypes.string.isRequired,
}

export default ImageInfo;