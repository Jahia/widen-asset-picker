// Used only if jahia-ui-root is the host, experimental
import('@jahia/app-shell/bootstrap').then(res => {
    console.log("[index.js] res :",res);
    window.jahia = res;
    res.startAppShell(window.appShell.remotes, window.appShell.targetId);
});

// // moved to init.js
// import {registry} from '@jahia/ui-extender';
//
// registry.add('callback', 'contentEditorExtensions', {
//     targets: ['jahiaApp-init:20'],
//     callback: () => import('./ContentEditorExtensions.register')
// });
