const validate = require('../validation/validate')
const todoSchema = require('../validation/schemas/todo')
const { addTodo, updateTodo, deleteTodo, getDoneTodos, getUndoneTodos } = require('../services/todo');

module.exports = (app) => {

    app.get('/todo', async (req, res) => {
        res.render('index', { undoneTasks: await getUndoneTodos(), doneTasks: await getDoneTodos() })
    });

    app.get('/todo/undone', async (req, res) => {
        res.json(await getUndoneTodos())
    });

    app.get('/todo/done', async (req, res) => {
        res.json(await getDoneTodos())
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

    app.patch('/todo/:id', async (req, res) => {
        const updates = req.body
        const id = req.params.id
        try {
            res.json(await updateTodo(id, updates))
        } catch (err) {
            res.json(err)
        }
    })

    app.delete('/todo/:id', async (req, res) => {
        try {
            res.json(await deleteTodo(req.params.id))
        }
        catch (err) {
            res.send(err)
        }
    });
}