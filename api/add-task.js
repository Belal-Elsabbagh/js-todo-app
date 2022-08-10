let taskListModel = require('../models/models').taskListModel

module.exports.addTask = function(task) {
    taskListModel.create({task: task})
    console.log("Record inserted Successfully.");
}