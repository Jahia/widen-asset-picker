import {registry} from '@jahia/ui-extender';
import register from './ContentEditorExtensions.register';

export default function () {
    registry.add('callback', 'contentEditorExtensions', {
        targets: ['jahiaApp-init:20'],
        callback: register
    });
}
