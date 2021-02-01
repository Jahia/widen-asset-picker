import {registry} from '@jahia/ui-extender';
import {registerSelectorTypes} from './ContentEditorExtensions/SelectorTypes';

// export default function () {
    registerSelectorTypes(registry);
    console.debug('%c Content Editor Widen Picker Extensions is activated', 'color: #3c8cba');
// }