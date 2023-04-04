import React from 'react';
import PropTypes from 'prop-types';
import {StoreContext} from '../../../contexts';
import {Typography} from '@jahia/moonstone';

import{formatDuration,formatFileSize} from './utils'


const ItemInfoCmp = ({properties}) => {
    const {state} = React.useContext(StoreContext);
    const {locale} = state;

    const {
        format,
        sizeKB
    } = properties;

    const {
        width,
        height,
        aspectRatio,
        duration
    } = ['width', 'height', 'aspectRatio', 'duration'].reduce((reducer, key) => {
        switch (key) {
            case 'aspectRatio':
                reducer[key] = Number(properties[key]).toLocaleString(locale, {maximumFractionDigits: 2}) || 'n/a';
                break;
            case 'duration':
                reducer[key] = properties[key] || null;
                break;
            default:
                reducer[key] = Number(properties[key]).toLocaleString(locale) || 'n/a';
                break;
        }

        return reducer;
    }, {});

    const renderItemInfo = () => {
        let info = `${width} x ${height} px (r:${aspectRatio})`;

        if(duration)
            info = `${info} - ${formatDuration(duration)}`;

        info = `${info} - ${format.toLowerCase()} - ${formatFileSize({sizeKB,locale})}`
        return info
    }

    return (
        <Typography variant="body">
             {renderItemInfo()}
        </Typography>
    );
};

ItemInfoCmp.propTypes = {
    properties: PropTypes.object.isRequired,
    // classes: PropTypes.object.isRequired
};

export const ItemInfo = ItemInfoCmp;

// export const ItemInfo = withStyles(styles)(ItemInfoCmp);
