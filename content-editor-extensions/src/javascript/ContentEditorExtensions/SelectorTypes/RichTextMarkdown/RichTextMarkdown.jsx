import React, {useState} from 'react';
import * as PropTypes from 'prop-types';
import MarkdownIt from 'markdown-it';
import {gfm} from 'turndown-plugin-gfm';
import TurndownService from 'turndown';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import './RichTextMarkdown.css';

const RichTextMarkdown = ({field, id, value, onChange}) => {
    const [valueText, setValueText] = useState('');

    const converter = new TurndownService({headingStyle: 'atx'}).use(gfm);
    const mdParser = new MarkdownIt(/* Markdown-it options */);

    const config = {
        view: {
            menu: true,
            md: true,
            html: false
        }
    };

    return (
        <MdEditor
            id={id}
            name={field.name}
            value={valueText || (value && converter.turndown(value))}
            readOnly={field.readOnly}
            style={{height: '500px', width: '100%'}}
            config={config}
            renderHTML={text => {
                setValueText(text);

                return mdParser.render(text);
            }}
            onChange={({html}) => onChange(html)}
        />
    );
};

RichTextMarkdown.propTypes = {
    field: PropTypes.object,
    id: PropTypes.string.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired
};

MdEditor.displayName = 'MdEditor';
RichTextMarkdown.displayName = 'RichTextMarkdown';

export default RichTextMarkdown;
