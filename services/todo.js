const {taskModel} = require('../models/models')

class Todo {
    addTodo = async (todoObject) => {
        return await taskModel.create(todoObject)
    }

    completeTodo = async (todoId) => {
        return await taskModel.findByIdAndUpdate(todoId, { isCompleted: true, timeCompleted: Date.now() })
    }

    deleteTodo = async (todoId) => {
        return await taskModel.findByIdAndDelete(todoId)
    }

    updateTodo = async (todoId, updates) => {
        return await taskModel.findByIdAndUpdate(todoId, updates, { new: true })
    }

    resetTodo = async (todoId) => {
        return await taskModel.findByIdAndUpdate(todoId, { isCompleted: false, timeCompleted: null })
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