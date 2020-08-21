import {registry} from '@jahia/ui-extender';

registry.add('callback', 'contentEditorExtensions', {
    targets: ['jahiaApp-init:20'],
    callback: () => import('./ContentEditorExtensions.register')
});
