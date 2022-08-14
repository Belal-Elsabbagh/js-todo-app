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

    resetTodo = async (todoObject) => {
        return await taskModel.updateOne(todoObject, { isCompleted: false, timeCompleted: null })
    }

    getTodos = async () => {
        return await taskModel.find({})
    }
    
    getDoneTodos = async () => {
        return await taskModel.find({isCompleted: true})
    }

    getUndoneTodos = async () => {
        return await taskModel.find({isCompleted: false})
    }
}

module.exports = new Todo()