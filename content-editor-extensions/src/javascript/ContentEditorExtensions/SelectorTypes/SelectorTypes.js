import RichTextMarkdown from './RichTextMarkdown';

export const registerSelectorTypes = registry => {
    registry.add('selectorType', 'Markdown', {cmp: RichTextMarkdown, supportMultiple: false});
};
