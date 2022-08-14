module.exports = async (schemaObject, todoObject) => {
    try {
        return await schemaObject.validateAsync(todoObject)
    } catch (err) {
        throw err
    }
}