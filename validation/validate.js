const ValidationError = require('../middleware/errors').ValidationError
module.exports.validate = async (schemaObject, objectToValidate) => {
    try {
        return await schemaObject.validateAsync(objectToValidate)
    } catch (err) {
        throw new ValidationError(`Failed to validate`)
    }
}

module.exports.isEmpty = (obj) => {
    return !(obj && Object.keys(obj).length === 0 && Object.getPrototypeOf(obj) === Object.prototype)
}