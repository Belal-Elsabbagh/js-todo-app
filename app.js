let express = require('express');
let bodyParser = require('body-parser')
let addTask = require('./api/add-task.js')
let models = require('./models/models');
let app = express()
app.set('view engine', 'ejs')
app.use('/assets', express.static('assets'))
let urlencodedParser = bodyParser.urlencoded({ extended: false })

app.get('/', function (req, res) {
    models.taskListModel.find({}, function(err, taskDocs) {
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
})

app.get('/complete/:id', function(req, res) {
    console.log("Triggered completion")
    models.taskListModel.findByIdAndUpdate(req.params.id, {isCompleted: true, timeCompleted: Date.now()}, function(err, docs){
        if(err) { 
            console.error(err)
            return
        }
    })
    console.log("Completed Task")
    res.redirect('back')
})

app.get('/reset/:id', function(req, res) {
    console.log("Triggered reset")
    models.taskListModel.findByIdAndUpdate(req.params.id, {isCompleted: false, timeCompleted: null}, function(err, docs){
        if(err) { 
            console.error(err)
            return
        }
    })
    console.log("reset Task")
    res.redirect('back')
})

app.get('/delete/:id', function(req, res) {
    console.log("Triggered deletion")
    models.taskListModel.findByIdAndDelete(req.params.id, function(err, docs){
        if(err) { 
            console.error(err)
            return
        }
    })
    console.log("Deleted Task")
    res.redirect('back')
})

app.post('/', urlencodedParser, function (req, res) {
    try {
        addTask.addTask(req.body.new_task)
        res.redirect('back')
    }
    catch (e) {
        console.log("Failed to add task.")
    }
})

app.listen(3000)