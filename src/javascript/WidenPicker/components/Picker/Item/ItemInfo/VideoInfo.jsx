import React from 'react';
import PropTypes from 'prop-types';
import{formatDuration} from '../../../utils'

const VideoInfo = ({properties, locale, classes}) => {
    const {
        width,
        height,
        aspect_ratio: aspectRatio,
        duration
    } = Object.keys(properties).reduce((reducer, key) => {
        switch (key) {
            case 'duration':
                reducer[key] = properties[key] || null;
                break;
            default:
                reducer[key] = properties[key] || 'n/a';
                break;
        }
        return reducer;
    }, {});

    return (
        <>
            <ul className={classes.stats}>
                <li title={`${width.toLocaleString(locale)} px`}>
                    <strong>Width</strong> {width.toLocaleString(locale)} px
                </li>
                <li title={`${height.toLocaleString(locale)} px`}>
                    <strong>Height</strong> {height.toLocaleString(locale)} px
                </li>
                <li>
                    <strong>Ratio</strong> {aspectRatio && aspectRatio.toLocaleString(locale, {maximumFractionDigits: 2})}
                </li>
            </ul>
            <ul className={classes.stats}>
                <li className={classes.w100}>
                    <strong>Duration</strong> {formatDuration(duration)}
                </li>
            </ul>
        </>
    );
};

VideoInfo.propTypes = {
    properties: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
    classes: PropTypes.object.isRequired
};

export default VideoInfo;
