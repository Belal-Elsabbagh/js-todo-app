const {ValidationError} = require('../middleware/errors')

/**
 * 
 * @param {Object} schemaObject 
 * @param {Object} objectToValidate 
 * @throws {ValidationError} If the object to validate is not valid
 * @returns 
 */
module.exports = async (schemaObject, objectToValidate) => {
    try {
        return await schemaObject.validateAsync(objectToValidate)
    } catch (err) {
        console.log(err)
        throw new ValidationError(`Failed to validate`, err.details)
    }
}