let express = require('express');
let bodyParser = require('body-parser')
let addTask = require('./api/add-task.js')
let models = require('./models/models');

let app = express()
app.set('view engine', 'ejs')
app.use('/assets', express.static('assets'))
let urlencodedParser = bodyParser.urlencoded({ extended: false })

app.get('/', function (req, res) {
    models.taskListModel.find({}, function (err, docs) {
        res.render('index', { tasks: docs })
    }).sort({isCompleted: 1,task: 1});
})

app.get('/complete/:id', function(req, res) {
    console.log("Triggered deletion")
    models.taskListModel.findByIdAndUpdate(req.params.id, {isCompleted: true}, function(err, docs){
        if(err) { 
            console.error(err)
            return
        }
    })
    console.log("Completed Task")
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