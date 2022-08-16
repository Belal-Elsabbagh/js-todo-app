let mongoose = require('mongoose')
module.exports.taskModel = mongoose.model('tasks',new mongoose.Schema({
    task: String, 
    isCompleted: { type: Boolean, default: false },
    timeCreated: { type : Date, default: Date.now },
    timeCompleted: {type: Date, default: null}
}))

module.exports.userModel = mongoose.model('users',new mongoose.Schema({
    email: String,
    password: String
}))