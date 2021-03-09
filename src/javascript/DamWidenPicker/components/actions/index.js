import React from 'react';
import {Edit, Cancel} from '@material-ui/icons';
import {DotsVertical} from 'mdi-material-ui';
import {unsetFieldAction} from 'src/javascript/DamWidenPicker/components/actions/unsetField.action';
import {replaceAction} from 'src/javascript/DamWidenPicker/components/actions/replace.action';

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

    registry.add('action', 'replaceWidenContent', replaceAction, {
        buttonIcon: <Edit/>,
        buttonLabel: 'content-editor:label.contentEditor.edit.fields.actions.replace',
        targets: ['WidenPickerActions:1']
    });

    registry.add('action', 'unsetFieldActionWidenPicker', unsetFieldAction, {
        buttonIcon: <Cancel/>,
        buttonLabel: 'content-editor:label.contentEditor.edit.fields.actions.clear',
        targets: ['WidenPickerActions:2']
    });
};
