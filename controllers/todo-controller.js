const validate = require('../validation/validate')
const {todoSchema} = require('../validation/schemas')
const { 
    addTodo, 
    completeTodo, 
    resetTodo, 
    updateTodo, 
    getTodoById, 
    deleteTodo, 
    getAllTodos, 
    getDoneTodos, 
    getUndoneTodos } = require('../services/').todoServices;

module.exports = (app) => {

    app.get('/todo', async (req, res) => {
        res.status(200).json(await getAllTodos());
    });

    app.get('/todo/:id', async (req, res, next) => {
        try {
            let todo = await getTodoById(req.params.id);
            res.status(200).json(todo)
        } catch(err){
            next(err)
        }
    });

    app.get('/todo/undone', async (req, res, next) => {
        try {
            res.status(200).json(await getUndoneTodos())
        } catch (err) {
            next(err)
        }
    });

    app.get('/todo/done', async (req, res) => {
        try {
            res.status(200).json(await getDoneTodos())
        } catch (err) {
            next(err)
        }
    });

    app.post('/todo', async (req, res, next) => {
        try {
            let todo = await validate(todoSchema, req.body)
            res.status(201).json(await addTodo(todo))
        }
        catch (err) {
            next(err)
        }
    });

    app.patch('/todo/:id', async (req, res, next) => {
        const updates = req.body
        const id = req.params.id
        try {
            res.status(200).json(await updateTodo(id, updates))
        } catch (err) {
            next(err)
        }
    })

    app.patch('/todo/complete/:id', async (req, res, next) => {
        const id = req.params.id
        try {
            res.status(200).json(await completeTodo(id))
        } catch (err) {
            next(err)
        }
    })

    app.patch('/todo/reset/:id', async (req, res, next) => {
        const id = req.params.id
        try {
            res.status(200).json(await resetTodo(id))
        } catch (err) {
            next(err)
        }
    })

    app.delete('/todo/:id', async (req, res, next) => {
        try {
            res.status(200).json(await deleteTodo(req.params.id))
        }
        catch (err) {
            next(err)
        }
    });
}