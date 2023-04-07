import React from 'react';
import {ErrorHandler} from './components';
import {WidenPicker} from './WidenPicker';
import {Store} from './Store';
import * as PropTypes from 'prop-types';
import {contextValidator} from './douane';


export const WidenPickerContextInitializer = ({field, id, value, editorContext, inputContext, onChange, onBlur}) => {
    let context = {
        widen: window.contextJsParameters?.config?.widen || {},
        editor: {field, value, editorContext, inputContext, onChange, onBlur}
    };

    try {
        context = contextValidator(context);

        return (
            <Store context={context}>
                <WidenPicker
                    id={id}
                    initEditorValue={context.editor.value}
                />
            </Store>
        );
    } catch (e) {
        console.error('error : ', e);
        return (
            <ErrorHandler
                item={e.message}
                errors={e.errors}
            />
        );
    }
};

WidenPickerContextInitializer.propTypes = {
    field: PropTypes.object,
    id: PropTypes.string.isRequired,
    value: PropTypes.string,
    editorContext: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    inputContext: PropTypes.object.isRequired
};
