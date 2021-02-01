import {registry} from '@jahia/ui-extender';
// import register from './ContentEditorExtensions.register';

registry.add('callback', 'contentEditorExtensions', {
    targets: ['jahiaApp-init:20'],
    // callback: register
    callback: () => import('./ContentEditorExtensions.register')
});
