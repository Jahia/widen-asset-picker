import React from 'react';
import {Edit, Cancel} from '@material-ui/icons';
import {DotsVertical} from 'mdi-material-ui';
import {unsetFieldAction} from './unsetField.action';
// import {replaceAction} from './replace.action';

//Note example https://github.com/Jahia/content-editor/blob/9cf8432b36ffc8c79e0f4484ce07ec03c71b95d8/src/javascript/SelectorTypes/Picker/actions/index.js
export const registerWidenPickerActions = registry => {
    registry.add('action', 'WidenPickerMenu', registry.get('action', 'menuAction'), {
        buttonIcon: <DotsVertical/>,
        buttonLabel: 'label.contentEditor.edit.action.fieldMoreOptions',
        menuTarget: 'WidenPickerActions',
        isShowIcons: true,
        displayFieldActions: (field, value) => {
            return !field.multiple && value;
        }
    });

//Note review the part below
//     registry.add('action', 'replaceWidenContent', replaceAction, {
//         buttonIcon: <Edit/>,
//         buttonLabel: 'content-editor:label.contentEditor.edit.fields.actions.replace',
//         targets: ['WidenPickerActions:1']
//     });

    registry.add('action', 'unsetFieldActionWidenPicker', unsetFieldAction, {
        buttonIcon: <Cancel/>,
        buttonLabel: 'content-editor:label.contentEditor.edit.fields.actions.clear',
        targets: ['WidenPickerActions:2']
    });
};
