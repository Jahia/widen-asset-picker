import React from 'react';
import {Edit, Cancel, MoreVert} from '@jahia/moonstone';
import {unsetFieldAction} from './unsetFieldAction';
import {replaceAction} from './replaceAction';

export const registerWidenPickerActions = registry => {
    registry.add('action', 'content-editor/field/WidenPicker', registry.get('action', 'menuAction'), {
        buttonIcon: <MoreVert/>,
        buttonLabel: 'label.contentEditor.edit.action.fieldMoreOptions',
        menuTarget: 'content-editor/field/WidenPickerActions',
        menuItemProps: {
            isShowIcons: true
        }
    });

    registry.add('action', 'replaceWidenContent', replaceAction, {
        buttonIcon: <Edit/>,
        buttonLabel: 'content-editor:label.contentEditor.edit.fields.actions.replace',
        targets: ['content-editor/field/WidenPickerActions:1']
    });

    registry.add('action', 'unsetFieldActionWidenPicker', unsetFieldAction, {
        buttonIcon: <Cancel/>,
        buttonLabel: 'content-editor:label.contentEditor.edit.fields.actions.clear',
        targets: ['content-editor/field/WidenPickerActions:2']
    });
};
