import {registry} from '@jahia/ui-extender';
import {registerSelectorTypes} from './ContentEditorExtensions/SelectorTypes';

registerSelectorTypes(registry);

console.debug('%c Content Editor Extensions is activated', 'color: #3c8cba');
