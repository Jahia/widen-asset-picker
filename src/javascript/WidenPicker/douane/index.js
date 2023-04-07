import * as Ajv from 'ajv';
import schema from './lib/schema';
import {ContextException} from '../misc/exceptions';

const ajv = new Ajv({useDefaults: true});
// Note the try catch should be done here and a React component should be returned
const contextValidator = context => {
    const valid = ajv.validate(schema.context, context);
    if (!valid) {
        throw new ContextException({
            message: 'Context configuration object',
            errors: ajv.errors
        });
        // Throw {item: 'Context configuration object', errors: ajv.errors};
    }

    return context;
};

export {
    contextValidator
};
