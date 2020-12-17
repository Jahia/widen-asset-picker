import React from "react";
import PropTypes from "prop-types";
import {Typography} from "@jahia/moonstone";
import {withStyles} from "@material-ui/core";

const styles = theme => ({
    // ratio:{
    //     fontSize:'.75em',
    //     fontStyle:'italic'
    // }
})

const VideoInfoCmp = ({properties,locale,classes}) => {
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
            {width} x {height} px (r:{aspectRatio}) | {formatDuration() }
        </Typography>
    )
}

VideoInfoCmp.propTypes={
    properties:PropTypes.object.isRequired,
    locale:PropTypes.string.isRequired,
    classes: PropTypes.object.isRequired
}

export const VideoInfo = withStyles(styles)(VideoInfoCmp);