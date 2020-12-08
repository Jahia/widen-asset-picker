import React from "react";
import PropTypes from "prop-types";
import {Typography} from "@jahia/moonstone";

const VideoInfo = ({properties,locale}) => {
    const {
        width,
        height,
        aspectRatio,
        duration
    } = ['width','height','aspectRatio','duration'].reduce((reducer,key) => {
        switch(true){
            case key === 'aspectRatio':
                reducer[key]= `${Number(properties[key]).toLocaleString(locale,{maximumFractionDigits:2})}` || 'n/a';
                break;
            case key === 'duration':
                reducer[key]= properties[key] || 'n/a';
                break;
            default:
                reducer[key]= `${Number(properties[key]).toLocaleString(locale)}` || 'n/a';
                break;
        }

        return reducer;
    },{});

    const formatDuration = () => {
        if(duration === 'n/a')
            return 'n/a';

        const dateObj = new Date(duration * 1000);
        const hours = dateObj.getUTCHours().toString().padStart(2, '0');
        const minutes = dateObj.getUTCMinutes().toString().padStart(2, '0');
        const seconds = dateObj.getSeconds().toString().padStart(2, '0');

        return `${hours}:${minutes}:${seconds}`;
    }

    return(
        <Typography
            data-sel-field-picker-info
            variant="omega"
            color="gamma"
        >
            {width} x {height} px <i> ( r : {aspectRatio})</i> | {formatDuration() }
        </Typography>
        // <>
        //     <ul className={classes.stats}>
        //         <li title={`${width.toLocaleString(locale)} px`}>
        //             <strong>Width</strong> {width.toLocaleString(locale)} px
        //         </li>
        //         <li title={`${height.toLocaleString(locale)} px`}>
        //             <strong>Height</strong> {height.toLocaleString(locale)} px
        //         </li>
        //         <li>
        //             <strong>Ratio</strong> {aspect_ratio && aspect_ratio.toLocaleString(locale,{maximumFractionDigits:2})}
        //         </li>
        //     </ul>
        //     <ul className={classes.stats}>
        //         <li className={classes.w100}>
        //             <strong>Duration</strong> {formatDuration()}
        //         </li>
        //     </ul>
        // </>
    )
}

VideoInfo.propTypes={
    properties:PropTypes.object.isRequired,
    locale:PropTypes.string.isRequired,
    // classes:PropTypes.object.isRequired
}

export default VideoInfo;