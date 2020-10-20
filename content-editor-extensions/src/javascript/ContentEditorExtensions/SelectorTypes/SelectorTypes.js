import RichTextMarkdown from './RichTextMarkdown';
import StringWidenPickerCmp from './StringWidenPicker';
import {registerWidenPickerActions} from "./StringWidenPicker/components/actions";

export const registerSelectorTypes = registry => {
    registry.add('selectorType', 'Markdown', {cmp: RichTextMarkdown, supportMultiple: false});
    registry.add('selectorType', 'WidenPicker', {cmp: StringWidenPickerCmp, supportMultiple: false});

    registerWidenPickerActions(registry);
};
