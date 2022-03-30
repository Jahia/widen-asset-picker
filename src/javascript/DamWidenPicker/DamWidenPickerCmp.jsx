import React from 'react';
import AjvError from './components/Error/Ajv';
import {WidenPicker} from './components/WidenPicker';
import {Store} from './Store';
import * as PropTypes from 'prop-types';
import {contextValidator} from './douane';

const DamWidenPickerCmp = ({field, id, value, editorContext, inputContext, onChange}) => {
    // Console.debug('[DamWidenPickerCmp] field',field);
    // console.debug('[DamWidenPickerCmp] id',id);
    // console.debug('[DamWidenPickerCmp] value',value);
    // console.debug('[DamWidenPickerCmp] editorContext',editorContext);
    // console.debug('[DamWidenPickerCmp] inputContext',inputContext);

    let context = {
        widen: {
            url: window.contextJsParameters.config.widen.url,
            version: window.contextJsParameters.config.widen.version,
            site: window.contextJsParameters.config.widen.site,
            token: window.contextJsParameters.config.widen.token,
            mountPoint: window.contextJsParameters.config.widen.mountPoint,
            lazyLoad: window.contextJsParameters.config.widen.lazyLoad,
            resultPerPage: window.contextJsParameters.config.widen.resultPerPage
        },
        editor: {
            onChange,
            field,
            value,
            editorContext,
            inputContext
        }
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
        // Note: create a generic error handler
        return (
            <AjvError
                item={e.message}
                errors={e.errors}
            />
        );
    }
};

DamWidenPickerCmp.propTypes = {
    field: PropTypes.object,
    id: PropTypes.string.isRequired,
    value: PropTypes.string,
    editorContext: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    inputContext: PropTypes.object.isRequired
};

DamWidenPickerCmp.displayName = 'DamWidenPicker';
export default DamWidenPickerCmp;
