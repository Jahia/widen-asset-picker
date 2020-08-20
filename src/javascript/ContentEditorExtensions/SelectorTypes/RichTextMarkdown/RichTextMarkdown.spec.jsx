import React from 'react';
import {shallow} from '@jahia/test-framework';

import RichTextMarkdown from './RichTextMarkdown';

describe('RichTextMarkdown', () => {
    let defaultProps;
    beforeEach(() => {
        defaultProps = {
            id: 'markdown-id-1',
            field: {
                name: 'myMarkdownName',
                displayName: 'My markdown name',
                readOnly: false,
                selectorType: 'Text',
                requiredType: 'STRING',
                selectorOptions: [{name: 'markdown'}]
            },
            value: 'This is my value for markdown',
            onChange: jest.fn()
        };
    });

    it('should contain MdEditor', () => {
        const cmp = shallow(<RichTextMarkdown {...defaultProps}/>);

        expect(cmp.find('MdEditor').exists()).toBeTruthy();
    });

    it('should render html in preview', () => {
        const cmp = shallow(<RichTextMarkdown {...defaultProps}/>);

        const previewHtml = cmp.find('MdEditor').props().renderHTML('my text value');

        expect(previewHtml).toBe('<p>my text value</p>\n');
        expect(cmp.find('MdEditor').props().value).toBe('my text value');
    });

    it('should update value on change', () => {
        const cmp = shallow(<RichTextMarkdown {...defaultProps}/>);

        cmp.find('MdEditor').simulate('change', {html: 'My new markdown value'});

        expect(defaultProps.onChange).toHaveBeenCalledWith('My new markdown value');
    });
});
