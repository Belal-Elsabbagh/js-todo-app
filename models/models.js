let mongoose = require('mongoose')
module.exports.taskListModel = mongoose.model('tasks',new mongoose.Schema({
    task: String, 
    isCompleted: { type: Boolean, default: false }
}))
