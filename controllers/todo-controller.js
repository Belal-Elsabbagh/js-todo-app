const validateTodo = require('../validation/validateTodo')
const {addTodo, completeTodo, deleteTodo, getTodos, resetTodo} = require('../services/todo')

module.exports = function (app) {
    app.get('/todo', async (req, res) => {
        let todos = await getTodos();
        res.render('index', {
            undoneTasks: todos.filter((i) => { return i.isCompleted == false }),
            doneTasks: todos.filter((i) => { return i.isCompleted == true })
        })
    });

    app.post('/todo', async (req, res) => {
        try {
            let taskToBeAdded = await validateTodo(req.body)
            res.send(await addTodo(taskToBeAdded))
        }
        catch (err) {
            res.json(err)
        }
    });

    app.post('/todo/complete',async (req, res) => {
        try {
            let taskToBeCompleted = await validateTodo(req.body)
            res.send(await completeTodo(taskToBeCompleted))
        }
        catch (err) {
            console.log(err)
            res.send(err)
        }
    });

    app.post('/todo/reset', async (req, res) => {
        try {
            let taskToBeReset = await validateTodo(req.body)
            res.send(await resetTodo(taskToBeReset))
        }
        catch (err) {
            res.send(err)
        }
    });

    app.delete('/todo/:task', async (req, res) => {
        try {
            let taskToBeDeleted = await validateTodo({task: req.params.task.replace(/_/g," ")})
            res.send(await deleteTodo(taskToBeDeleted))
        }
        catch (err) {
            res.send(err)
        }
    });
}