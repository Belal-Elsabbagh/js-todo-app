import { ValidationError } from '../middleware/errors'

/**
 * 
 * @param {Object} schemaObject 
 * @param {Object} objectToValidate 
 * @throws {ValidationError} If the object to validate is not valid
 * @returns 
 */
export default async (schemaObject: any, objectToValidate:any) => {
    try {
        return await schemaObject.validateAsync(objectToValidate)
    } catch (err: any) {
        throw new ValidationError(`Failed to validate`, err.details)
    }
}