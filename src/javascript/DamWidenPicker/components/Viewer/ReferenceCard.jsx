import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'clsx';
import {withStyles} from '@material-ui/core';
import {HandleDrag, Typography} from '@jahia/moonstone';
import {StoreContext} from '../../contexts';
import {ItemInfo} from './ItemInfo/ItemInfo';

const unitIndex = 12;// Prev 9

const styles = theme => ({
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    add: {
        width: '100%',
        height: theme.spacing.unit * unitIndex,
        backgroundColor: theme.palette.ui.epsilon,
        border: `1px ${theme.palette.ui.zeta} dashed`,
        fontSize: '0.875rem',
        borderRadius: '2px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        '&:hover': {
            border: `1px solid ${theme.palette.ui.zeta}`
        },
        '&:focus': {
            outline: 'none',
            border: `1px solid ${theme.palette.brand.beta}`
        },
        '& svg': {
            margin: theme.spacing.unit,
            color: theme.palette.ui.zeta
        }
    },
    addReadOnly: {
        outline: 'none',
        background: theme.palette.ui.alpha,
        border: `1px solid ${theme.palette.ui.alpha}!important`,
        cursor: 'default'
    },
    fieldContainer: {
        width: '100%',
        height: theme.spacing.unit * unitIndex,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        border: `1px ${theme.palette.ui.zeta} solid`,
        boxShadow: '1px 5px 6px rgba(64, 77, 86, 0.1)',
        borderRadius: '2px',
        paddingRight: theme.spacing.unit,
        '& button': {
            color: theme.palette.font.beta
        },
        cursor: 'pointer'
    },
    fieldContainerReadOnly: {
        border: `1px ${theme.palette.ui.omega} solid`,
        boxShadow: 'none',
        cursor: 'default'
    },
    fieldFigureContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: `calc(${theme.spacing.unit * unitIndex}px - 2px)`,
        width: theme.spacing.unit * unitIndex,
        overflow: 'hidden',
        backgroundColor: theme.palette.ui.omega
    },
    fieldImage: {
        textAlign: 'center',
        margin: 0,
        maxWidth: theme.spacing.unit * unitIndex,
        maxHeight: `calc(${theme.spacing.unit * unitIndex}px - 2px)`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain'
    },
    fieldSelectedMetadata: {
        flexGrow: 1,
        padding: '1rem 2rem',
        width: 'calc(100% - 144px)',
        '& p': {
            width: '360px',
            padding: 0,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
        }
    },
    referenceButtonEmptyContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    draggableIcon: {
        cursor: 'grab'
    },
    vAlign: {
        verticalAlign: 'middle'
    }
});

const ReferenceCardCmp = ({
    classes,
    isReadOnly,
    emptyLabel,
    emptyIcon,
    fieldData,
    labelledBy,
    onClick,
    isDraggable
}) => {
    const {state} = React.useContext(StoreContext);
    const {
        locale
    } = state;

    // If card have already data
    if (fieldData) {
        const {
            filename,
            thumbnail
        } = fieldData;
        let {
            // CreatedDate,
            updatedDate
            // DeletedDate,
            // lastModified
        } = fieldData;

        const formatDate = date => {
            if (!date) {
                return;
            }

            const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
            date = new Date(date);
            return date.toLocaleDateString(locale, options);
        };

        // CreatedDate = formatDate(createdDate);
        updatedDate = formatDate(updatedDate);
        // DeletedDate = formatDate(deletedDate);

        const nameId = `${labelledBy}-name`;
        return (
            <div className={classes.container}>
                {isDraggable &&
                <div className={classes.draggableIcon}>
                    <HandleDrag size="big"/>
                </div>}

                <article
                    className={classnames(
                        classes.fieldContainer,
                        (readOnly ? classes.fieldContainerReadOnly : ''),
                        (isDraggable ? classes.draggableIcon : '')
                    )}
                    data-sel-field-picker="filled"
                    data-sel-field-picker-action="openPicker"
                    role="button"
                    tabIndex="0"
                    aria-labelledby={labelledBy}
                    onClick={() => {
                        if (readOnly) {
                            return;
                        }

                        onClick(true);
                    }}
                >
                    <div className={classes.fieldFigureContainer}>
                        <img src={thumbnail} className={classes.fieldImage} aria-labelledby={nameId} alt=""/>
                    </div>
                    <div className={classes.fieldSelectedMetadata}>
                        {/* <ItemInfo properties={fieldData} labelledBy={labelledBy}/> */}
                        <Typography
                            data-sel-field-picker-name
                            variant="zeta"
                            color="alpha"
                            id={nameId}
                        >
                            {filename}
                        </Typography>
                        <ItemInfo properties={fieldData} locale={locale}/>
                        <Typography
                            data-sel-field-picker-info
                            variant="omega"
                            color="gamma"
                        >
                            last updated : {updatedDate}
                        </Typography>
                    </div>
                </article>
            </div>
        );
    }

    return (
        <button
            data-sel-media-picker="empty"
            data-sel-field-picker-action="openPicker"
            className={`${classes.add} ${readOnly ? classes.addReadOnly : ''}`}
            type="button"
            aria-disabled={readOnly}
            aria-labelledby={labelledBy}
            onClick={() => {
                if (readOnly) {
                    return;
                }

                onClick(true);
            }}
        >
            {!readOnly &&
            <div className={classes.referenceButtonEmptyContainer}>
                {emptyIcon}
                <Typography variant="omega" color="beta" component="span">
                    {emptyLabel}
                </Typography>
            </div>}
        </button>
    );
};

ReferenceCardCmp.defaultProps = {
    isDraggable: false,
    readOnly: false,
    fieldData: null,
    emptyLabel: '',
    emptyIcon: null,
    onClick: () => {}
};

ReferenceCardCmp.propTypes = {
    isReadOnly: PropTypes.bool,
    classes: PropTypes.object.isRequired,
    onClick: PropTypes.func,
    fieldData: PropTypes.object, // Note: do as below
    // fieldData: PropTypes.shape({
    //     url: PropTypes.string.isRequired,
    //     name: PropTypes.string.isRequired,
    //     info: PropTypes.string.isRequired
    // }),
    isDraggable: PropTypes.bool,
    emptyLabel: PropTypes.string,
    emptyIcon: PropTypes.element,
    labelledBy: PropTypes.string
};

export const ReferenceCard = withStyles(styles)(ReferenceCardCmp);

ReferenceCard.displayName = 'ReferenceCard';
