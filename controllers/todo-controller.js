const validate = require('../validation/validate')
const todoSchema = require('../validation/schemas/todo')
const { addTodo, completeTodo, deleteTodo, resetTodo, getDoneTodos, getUndoneTodos } = require('../services/todo')

module.exports = (app) => {

    app.get('/todo', async (req, res) => {
        res.render('index', { undoneTasks: await getUndoneTodos(), doneTasks: await getDoneTodos() })
    });

    app.get('/todo/undone', async (req, res) => {
        res.json( await getUndoneTodos())
    });

    app.get('/todo/done', async (req, res) => {
        res.json( await getDoneTodos())
    });

    app.post('/todo', async (req, res) => {
        try {
            let todo = await validate(todoSchema, req.body)
            res.json(await addTodo(todo))
        }
        catch (err) {
            res.json(err)
        }
    });

    app.post('/todo/complete', async (req, res) => {
        try {
            res.json(await completeTodo(await validate(todoSchema, req.body)))
        }
        catch (err) {
            console.log(err)
            res.send(err)
        }
    });

    app.post('/todo/reset', async (req, res) => {
        try {
            res.json(await resetTodo(await validate(todoSchema, req.body)))
        }
        catch (err) {
            res.send(err)
        }
    });

    app.delete('/todo/:task', async (req, res) => {
        try {
            res.json(await deleteTodo(await validate(todoSchema, { task: req.params.task.replace(/_/g, " ") })))
        }
        catch (err) {
            res.send(err)
        }
    });
}