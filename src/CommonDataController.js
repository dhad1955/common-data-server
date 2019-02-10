const AES256Crypto = require('./AES256Crypto');
const RedisDatastore = require('./RedisDatastore');
const CommonData = require('./CommonData');

const getValidationErrors = function(input, schemaName) {
    const validate = require('jsonschema').validate;
    const result = validate(input, require(`./Schema/${schemaName}`));

    if(result.errors.length > 0) {
        return result.errors.map(err => {
            return {
                name: err.name,
                argument: err.argument,
                stack: err.stack
            };
        });
    }
    
    return [];
};

const store = async function(request, res, next) {

    try {
        const validationResults = getValidationErrors(request.body, 'StoreCommonData');

        if (validationResults.length) {
            res.status(400);
            
            return res.json(validationResults);
        }

        const common = new CommonData(RedisDatastore, new AES256Crypto(request.body.encryption_key));
        await common.store(request.body.id, request.body.value);
        
        return res.json({});
    } catch (e) {
        console.log(e);
        res.status(500);
        
        return res.json(e);
    }
};

const findAll = async function(request, res, next) {
    try {
        const validationResults = getValidationErrors(request.body, 'GetCommonData');

        if (validationResults.length) {
            res.status(400);
            
            return res.json(validationResults);
        }

        const common = new CommonData(RedisDatastore, new AES256Crypto(request.body.encryption_key));
        const result = await common.findAll(request.body.id);
        
        return res.json(result);
    } catch (e) {
        console.log(e);
        res.status(500);
        
        return res.json(e);
    }
};

exports.findAll = findAll;
exports.store = store;
exports._getValidationErrors = getValidationErrors;
