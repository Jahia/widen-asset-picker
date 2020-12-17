import React from 'react';
import {StoreContext} from '../../../../contexts';
import PropTypes from "prop-types";
import {withStyles,Button} from "@material-ui/core";
import classnames from "clsx";

const styles = theme => ({
    root:{
        //flex: '0 0 auto',
        color: '#393B3C',
        margin: '0 3px',
        padding: '0 6px',
        overflow: 'visible',
        fontSize: '.875rem',
        textAlign: 'center',
        boxSizing: 'border-box',
        transition: 'color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        boxShadow: 'none',
        borderRadius: theme.spacing.unit * 2,//50%
        height: theme.spacing.unit * 4,
        minWidth: theme.spacing.unit * 4,
        '&:hover':{
            backgroundColor: 'rgba(0, 0, 0, 0.06)',
        }
    },
    active:{
        backgroundColor: 'rgba(0, 0, 0, 0.08)',
    }
})

const PageLinkCmp = ({index,classes}) => {
    const {state, dispatch} = React.useContext(StoreContext);
    const {
        searchResultPageIndex
    } = state;

    const isActive = searchResultPageIndex === index;

    const handleGoToPage = () =>
        dispatch({
            case: 'GOTO_RESULT_PAGE',
            payload: {
                index
            }
        });

    return (
        <li>
            <Button
                className={classnames(
                    classes.root,
                    (isActive ? classes.active : '')
                )}
                onClick={handleGoToPage}>
                {index}
            </Button>
        </li>
    );
};
PageLinkCmp.propTypes={
    index:PropTypes.number.isRequired,
    classes: PropTypes.object.isRequired,
}

export const PageLink = withStyles(styles)(PageLinkCmp);
