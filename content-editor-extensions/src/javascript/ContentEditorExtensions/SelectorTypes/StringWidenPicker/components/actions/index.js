import {Edit, Cancel, Launch} from '@material-ui/icons';
import {DotsVertical, FileUpload} from 'mdi-material-ui';
import React from 'react';
import {unsetFieldAction} from './unsetField.action';
// import {openInTabAction} from './openInTab.action';
import {replaceAction} from './replace.action';

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

    // registry.add('action', 'MediaPickerMenu', registry.get('action', 'menuAction'), {
    //     buttonIcon: <DotsVertical/>,
    //     buttonLabel: 'label.contentEditor.edit.action.fieldMoreOptions',
    //     menuTarget: 'MediaPickerActions',
    //     isShowIcons: true,
    //     displayFieldActions: (field, value) => {
    //         return !field.multiple && value;
    //     }
    // });

    registry.add('action', 'replaceWidenContent', replaceAction, {
        buttonIcon: <Edit/>,
        buttonLabel: 'content-editor:label.contentEditor.edit.fields.actions.replace',
        targets: ['WidenPickerActions:1']
    });

    // registry.add('action', 'openInNewTab', openInTabAction, {
    //     buttonIcon: <Launch/>,
    //     buttonLabel: 'content-editor:label.contentEditor.edit.fields.actions.newTab',
    //     targets: ['ContentPickerActions:2', 'MediaPickerActions:2']
    // });

    registry.add('action', 'unsetFieldActionWidenPicker', unsetFieldAction, {
        buttonIcon: <Cancel/>,
        buttonLabel: 'content-editor:label.contentEditor.edit.fields.actions.clear',
        targets: ['WidenPickerActions:3']
    });

    // const fileUploadJContentAction = {
    //     ...registry.get('action', 'fileUpload'),
    //     targets: null // Remove target to avoid entry duplication
    // };
    // registry.add('action', 'upload', fileUploadJContentAction, {
    //     buttonIcon: <FileUpload/>,
    //     buttonLabel: 'content-editor:label.contentEditor.edit.fields.contentPicker.fileUploadBtn',
    //     targets: ['pickerDialogAction:0'],
    //     contentType: 'jnt:file'
    // });
};
