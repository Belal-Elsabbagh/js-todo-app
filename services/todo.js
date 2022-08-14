let taskModel = require('../models/models').taskModel

class Todo {
    addTodo = async (todoObject) => {
        return await taskModel.create(todoObject)
    }

    completeTodo = async (todoObject) => {
        return await taskModel.updateOne(todoObject, { isCompleted: true, timeCompleted: Date.now() })
    }

    deleteTodo = async (todoObject) => {
        return await taskModel.deleteOne(todoObject)
    }

    getTodos = async () => {
        return await taskModel.find({})
    }

    resetTodo = async (todoObject) => {
        return await taskModel.updateOne(todoObject, { isCompleted: false, timeCompleted: null })
    }
}

module.exports = new Todo()