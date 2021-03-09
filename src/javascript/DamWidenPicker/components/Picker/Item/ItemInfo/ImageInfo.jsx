import React from 'react';
import PropTypes from 'prop-types';

const ImageInfo = ({properties, locale, classes}) => {
    // Reduce is used to manage case {width = null} for svg image for example
    // default value works only for undefined
    const {
        width,
        height,
        aspect_ratio: aspectRatio
    } = Object.keys(properties).reduce((reducer, key) => {
        reducer[key] = properties[key] || 'n/a';
        return reducer;
    }, {});

    return (
        <ul className={classes.stats}>
            <li>
                <strong>Width</strong> {width.toLocaleString(locale)} px
            </li>
            <li>
                <strong>Height</strong> {height.toLocaleString(locale)} px
            </li>
            <li>
                <strong>Ratio</strong> {aspectRatio.toLocaleString(locale, {maximumFractionDigits: 2})}
            </li>
        </ul>
    );
};

ImageInfo.propTypes = {
    properties: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
    classes: PropTypes.object.isRequired
};

export default ImageInfo;
