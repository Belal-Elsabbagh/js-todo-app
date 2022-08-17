const { taskModel } = require('../models/models')
const { NotFoundError } = require('../middleware/errors')
class Todo {
    addTodo = async (todoObject) => {
        return await taskModel.create(todoObject)
    }

    /**
     * 
     * @param {string} todoId
     * @throws {NotFoundError} If the todo is not found
     * @returns 
     */
    getTodoById = async (todoId) => {
        let queryResult = await taskModel.findById(todoId);
        if (queryResult === null) throw new NotFoundError(`Todo with id ${todoId} was not found`);
        return queryResult;
    }

    completeTodo = async (todoId) => {
        try {
            let result = getTodoById(todoId)
            return await taskModel.findByIdAndUpdate(todoId, { isCompleted: true, timeCompleted: Date.now() })
        } catch (err) {
            throw err
        }
    }

    deleteTodo = async (todoId) => {
        try {
            let result = getTodoById(todoId)
            return await taskModel.findByIdAndDelete(todoId)
        } catch (err) {
            throw err
        }
    }

    updateTodo = async (todoId, updates) => {
        try {
            let result = getTodoById(todoId)
            return await taskModel.findByIdAndUpdate(todoId, updates, { new: true })
        } catch (err) {
            throw err
        }
    }

    resetTodo = async (todoId) => {
        try {
            let result = getTodoById(todoId)
            return await taskModel.findByIdAndUpdate(todoId, { isCompleted: false, timeCompleted: null })
        } catch (err) {
            throw err
        }
    }

    getTodos = async () => {
        return await taskModel.find({})
    }

    getDoneTodos = async () => {
        return await taskModel.find({ isCompleted: true })
    }

    getUndoneTodos = async () => {
        return await taskModel.find({ isCompleted: false })
    }
}

module.exports = new Todo()