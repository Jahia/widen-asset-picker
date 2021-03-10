export default {
    context: {
        title: 'context validation schema ',
        description: 'context is an object provided by the page in charge to load the app',
        type: 'object',
        properties: {
            widen: {
                type: 'object',
                properties: {
                    url: {
                        type: 'string',
                        format: 'uri'
                    },
                    site: {
                        type: 'string'
                    },
                    token: {
                        type: 'string'
                    },
                    version: {
                        type: 'string'
                    },
                    mountPoint: {
                        type: 'string'
                    },
                    lazyLoad: {
                        type: 'boolean',
                        default: true
                    },
                    resultPerPage: {
                        type: 'integer',
                        default: 20
                    }
                },
                required: ['url', 'site', 'token', 'version', 'lazyLoad', 'resultPerPage', 'mountPoint'],
                additionalProperties: false
            },
            editor: {
                type: 'object',
                properties: {
                    onChange: {},
                    setActionContext: {},
                    field: {
                        type: 'object',
                        properties: {}, // Note: fix the expected properties
                        required: []// Note: update based on propeties
                        // additionalProperties:false
                    },
                    value: { // Should be the uuid or null
                        type: ['string', 'null']
                    },
                    editorContext: {
                        type: 'object',
                        properties: {}, // Note: fix the expected properties
                        required: []// Note: update based on propeties
                        // additionalProperties:false
                    }
                },
                required: ['onChange', 'setActionContext', 'field', 'editorContext'],
                additionalProperties: false
            }
        },
        required: [
            'widen',
            'editor'
        ],
        additionalProperties: false
    }
};
