import * as Ajv from 'ajv';
import schema from './lib/schema';

const ajv = new Ajv({useDefaults: true});
// Note the try catch should be done here and a React component should be returned
const contextValidator = context => {
    const valid = ajv.validate(schema.context, context);
    if (!valid){
    // Throw new Error(`An error occurred during the validation of context object, errors : ${JSON.stringify(ajv.errors)}`);
        throw {item: 'Context configuration object', errors: ajv.errors};
    }

    return context;
};

export {
    contextValidator
};
