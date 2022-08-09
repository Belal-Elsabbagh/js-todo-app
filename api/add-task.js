let database = require('../config/database.js')


module.exports.addTask = function(task) {
    database.databaseConnection.collection('tasks').insertOne({task: task, isCompleted: false}, function (err, collection) {
        if (err) throw err;
        console.log("Record inserted Successfully.");
        return
    });
}