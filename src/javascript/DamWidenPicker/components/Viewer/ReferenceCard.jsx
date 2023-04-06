import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {withStyles} from '@material-ui/core';
import {HandleDrag, Typography} from '@jahia/moonstone';
import {StoreContext} from '../../contexts';
import {ItemInfo} from './ItemInfo/ItemInfo';
import {getFileFormatIcon} from "./ItemInfo/utils";

const styles = theme => ({
    container: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    add: {
        width: '100%',
        color: 'var(--color-gray_dark60)',
        height: theme.spacing.unit * 9,
        backgroundColor: theme.palette.ui.epsilon,
        border: '1px var(--color-gray40) dashed',
        fontSize: '0.875rem',
        borderRadius: '2px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        '&:hover': {
            border: '1px var(--color-gray40) solid'
        },
        '&:focus': {
            outline: 'none',
            border: '1px var(--color-gray40) solid'
        },
        '& svg': {
            marginBottom: 'var(--spacing-nano)'
            // margin: theme.spacing.unit,
            // color: theme.palette.ui.zeta
        }
    },
    addError: {
        border: '1px var(--color-warning) solid',
        '&:hover': {
            border: '1px var(--color-warning) solid'
        },
        '&:focus': {
            border: '1px var(--color-warning) solid'
        }
    },
    addReadOnly: {
        outline: 'none',
        background: theme.palette.ui.alpha,
        border: '1px var(--color-gray40) solid',
        '&:hover': {
            border: '1px var(--color-gray40) solid'
        },
        '&:focus': {
            border: '1px var(--color-gray40) solid'
        },
        cursor: 'default'
    },
    fieldContainer: {
        width: '100%',
        height: theme.spacing.unit * 9,
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
        height: `calc(${theme.spacing.unit * 9}px - 2px)`,
        width: theme.spacing.unit * 9,
        overflow: 'hidden',
        backgroundColor: theme.palette.ui.omega
    },
    fieldImage: {
        textAlign: 'center',
        margin: 0,
        maxWidth: theme.spacing.unit * 9,
        maxHeight: `calc(${theme.spacing.unit * 9}px - 2px)`,
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
    error: {
        color: 'var(--color-warning)'
    },
    draggableIcon: {
        cursor: 'grab'
    },
    vAlign: {
        verticalAlign: 'middle'
    }
});

const formatDate = ({date,locale}) => {
    if (!date) {
        return;
    }

    const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
    date = new Date(date);
    return date.toLocaleDateString(locale, options);
};

const ReferenceCardCmp = ({
    classes,
    isReadOnly,
    isError,
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



        // CreatedDate = formatDate(createdDate);
        updatedDate = formatDate({date:updatedDate,locale});
        // DeletedDate = formatDate(deletedDate);

        const nameId = `${labelledBy}-name`;
        return (
            <div className={classes.container}>
                {isDraggable &&
                <div className={classes.draggableIcon}>
                    <HandleDrag size="big"/>
                </div>}

                <article
                    className={clsx(
                        classes.fieldContainer,
                        (isReadOnly ? classes.fieldContainerReadOnly : ''),
                        (isDraggable ? classes.draggableIcon : '')
                    )}
                    role="button"
                    tabIndex="0"
                    aria-labelledby={labelledBy}
                    onClick={() => {
                        if (isReadOnly) {
                            return;
                        }

                        onClick();
                    }}
                >
                    <div className={classes.fieldFigureContainer}>
                        <img src={thumbnail} className={classes.fieldImage} aria-labelledby={nameId} alt=""/>
                    </div>
                    <div className={classes.fieldSelectedMetadata}>
                        {/* <ItemInfo properties={fieldData} labelledBy={labelledBy}/> */}
                        <Typography variant="caption" id={nameId}>
                            {getFileFormatIcon(fieldData.type,classes)} {filename}
                        </Typography>
                        <ItemInfo properties={fieldData} locale={locale}/>
                        <Typography variant="caption">
                            last updated : {updatedDate}
                        </Typography>
                    </div>
                </article>
            </div>
        );
    }

    return (
        <button
            className={clsx(classes.add, isReadOnly && classes.addReadOnly, isError && classes.addError)}
            type="button"
            aria-disabled={isReadOnly}
            aria-labelledby={labelledBy}
            onClick={() => {
                if (isReadOnly) { return; }
                onClick();
            }}
        >
            {!isReadOnly &&
            <div className={clsx(classes.referenceButtonEmptyContainer, isError && classes.error)}>
                {emptyIcon}
                <Typography variant="body" component="span">
                    {emptyLabel}
                </Typography>
            </div>}
        </button>
    );
};

ReferenceCardCmp.defaultProps = {
    isDraggable: false,
    isReadOnly: false,
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
