const todo = require('./schemas/todo');
module.exports = async (todoObject) => {
    try {
        return await todo.validateAsync(todoObject)
    } catch (err) {
        throw err
    }
}