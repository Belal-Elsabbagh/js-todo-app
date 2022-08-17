const { todoModel } = require('../models/models')
const { NotFoundError } = require('../middleware/errors')
class Todo {
    addTodo = async (todoObject) => {
        return await todoModel.create(todoObject)
    }

    /**
     * 
     * @param {string} todoId
     * @throws {NotFoundError} If the todo is not found
     * @returns 
     */
    getTodoById = async (todoId) => {
        let queryResult = await todoModel.findById(todoId);
        if (queryResult === null) throw new NotFoundError(`Todo with id ${todoId} was not found`);
        return queryResult;
    }

    completeTodo = async (todoId) => {
        try {
            let result = this.getTodoById(todoId)
            return await todoModel.findByIdAndUpdate(todoId, { isCompleted: true, timeCompleted: Date.now() }, { new: true })
        } catch (err) {
            throw err
        }
    }

    deleteTodo = async (todoId) => {
        try {
            let result = this.getTodoById(todoId)
            return await todoModel.findByIdAndDelete(todoId)
        } catch (err) {
            throw err
        }
    }

    updateTodo = async (todoId, updates) => {
        try {
            let result = this.getTodoById(todoId)
            return await todoModel.findByIdAndUpdate(todoId, updates, { new: true })
        } catch (err) {
            throw err
        }
    }

    resetTodo = async (todoId) => {
        try {
            let result = this.getTodoById(todoId)
            return await todoModel.findByIdAndUpdate(todoId, { isCompleted: false, timeCompleted: null }, { new: true })
        } catch (err) {
            throw err
        }
    }

    getAllTodos = async () => {
        return await todoModel.find({})
    }

    getDoneTodos = async () => {
        return await todoModel.find({ isCompleted: true })
    }

    getUndoneTodos = async () => {
        return await todoModel.find({ isCompleted: false })
    }
}

module.exports = new Todo()