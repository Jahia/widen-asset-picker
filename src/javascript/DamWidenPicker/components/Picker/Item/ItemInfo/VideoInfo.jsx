import React from 'react';
import PropTypes from 'prop-types';

const VideoInfo = ({properties, locale, classes}) => {
    const {
        width,
        height,
        aspect_ratio: aspectRatio,
        duration
    } = Object.keys(properties).reduce((reducer, key) => {
        reducer[key] = properties[key] || 'n/a';
        return reducer;
    }, {});

    const formatDuration = () => {
        if (duration === 'n/a') {
            return 'n/a';
        }

        const dateObj = new Date(duration * 1000);
        const hours = dateObj.getUTCHours().toString().padStart(2, '0');
        const minutes = dateObj.getUTCMinutes().toString().padStart(2, '0');
        const seconds = dateObj.getSeconds().toString().padStart(2, '0');

        return `${hours}:${minutes}:${seconds}`;
    };

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
                    <strong>Duration</strong> {formatDuration()}
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
