let mongoose = require('mongoose')
let database = require('../config/database')
module.exports.taskListModel = mongoose.model('tasks',new mongoose.Schema({
    task: String, 
    isCompleted: { type: Boolean, default: false },
    timeCreated: { type : Date, default: Date.now },
    timeCompleted: {type: Date, default: null}
}))
