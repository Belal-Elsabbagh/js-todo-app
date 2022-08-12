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
        try {
            models.taskModel.create(req.body, function(err, data) {
                if(err) throw err; 
                res.json(data)
            })
        }
        catch (err) {
            res.send(err)
        }
    });

    app.post('/todo/complete/:task',function(req, res) {
        try{
            let taskObject = {task: req.params.task.replace(/\-/g, " ")}
            console.log(taskObject)
            models.taskModel.updateOne(taskObject, {isCompleted: true}, function(err, docs){
                if(err) throw (err)
                res.send(docs)
            })
        }
        catch(err){
            res.send(err)
        }

    });

    app.post('/todo/delete/:task',function(req, res) {
        try{
            taskObject = {task: req.params.task.replace(/\-/g, " ")}
            console.log(taskObject)
            models.taskModel.deleteOne(taskObject, function(err, docs){
                if(err) throw (err)
                res.send(docs)
            })
        }
        catch(err){
            res.send(err)
        }

    });
}