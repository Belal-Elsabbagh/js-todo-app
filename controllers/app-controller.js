let models = require('../models/models');
let urlencodedParser = require('body-parser').urlencoded({ extended: false })

module.exports = function(app){
    app.get('/todo',function(req, res) {
        models.taskModel.find({}, function(err, taskDocs) {
            let undoneTasks = taskDocs.filter(function (el) {
                return el.isCompleted == false
            });
            let doneTasks = taskDocs.filter(function (el) {
                return el.isCompleted == true
            });
            res.render('index', { 
                undoneTasks: undoneTasks, 
                doneTasks:doneTasks 
            })
        })
    });

    app.post('/todo', urlencodedParser, function(req, res) {
        let taskToBeAdded = req.body
        try {
            if(!('task' in taskToBeAdded)) throw new Error("Wrong object format")
            models.taskModel.create(taskToBeAdded, function(err, data) {
                if(err) throw err; 
                res.json(data)
            })
        }
        catch (err) {
            res.json(err)
        }
    });

    app.post('/todo/complete', urlencodedParser, function(req, res) {
        let taskToBeCompleted = req.body
        try{
            if(!('task' in taskToBeCompleted)) throw new Error("Wrong object format")
            models.taskModel.updateOne(taskToBeCompleted, {isCompleted: true, timeCompleted: Date.now()}, function(err, docs){
                if(err) throw (err)
                res.json(docs)
            })
        }
        catch(err){
            res.send(err)
        }
    });

    app.post('/todo/reset', urlencodedParser, function(req, res) {
        let taskToBeReset = req.body
        try{
            if(!('task' in taskToBeReset)) throw new Error("Wrong object format")
            models.taskModel.updateOne(taskToBeReset, {isCompleted: false, timeCompleted: Date.now()}, function(err, docs){
                if(err) throw (err)
                res.json(docs)
            })
        }
        catch(err){
            res.send(err)
        }
    });

    app.post('/todo/delete',function(req, res) {
        let taskToBeDeleted = req.body
        try{
            if(!('task' in taskToBeAdded)) throw new Error("Wrong object format")
            models.taskModel.deleteOne(taskToBeDeleted, function(err, docs){
                if(err) throw (err)
                res.json(docs)
            })
        }
        catch(err){
            res.send(err)
        }

    });
}