import React from 'react';
import PropTypes from 'prop-types';

export const ReplaceActionComponent = ({field, inputContext, render: Render, loading: Loading, ...others}) => {
    return (
        <Render
            {...others}
            enabled={!field.readOnly}
            onClick={() => {
                inputContext.actionContext.dispatch({
                    case: 'TOGGLE_SHOW_PICKER'
                });
            }}
        />
    );
};

ReplaceActionComponent.propTypes = {
    field: PropTypes.object.isRequired,
    inputContext: PropTypes.object.isRequired,
    render: PropTypes.func.isRequired,
    loading: PropTypes.func
};

export const replaceAction = {
    component: ReplaceActionComponent
};
