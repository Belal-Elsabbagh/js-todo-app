const validate = require('../validation/validate')
const { todoSchema } = require('../validation/schemas');
const { ValidationError } = require('../middleware/errors');
const {
    addTodo,
    completeTodo,
    resetTodo,
    updateTodo,
    getTodoById,
    deleteTodo,
    getAllTodos,
    getTodos
} = require('../services/').todoServices;

module.exports = (app) => {

    app.get('/todos', async (req, res) => {
        res.status(200).json(await getAllTodos());
    });

    app.get('/todos/:id', async (req, res, next) => {
        try {
            let todo = await getTodoById(req.params.id);
            res.status(200).json(todo)
        } catch (err) {
            next(err)
        }
    });

    app.get('/todos/:isDone', async (req, res, next) => {
        try {
            if (req.params.isDone !== 'true' || req.params.isDone !== 'false')
                throw new ValidationError('isDone must be \'true\' or \'false\'')
            let filter = { isCompleted: (req.params.isDone === 'true') };
            res.status(200).json(await getTodos(filter))
        } catch (err) {
            next(err)
        }
    });

    app.post('/todos', async (req, res, next) => {
        try {
            let todo = await validate(todoSchema, req.body)
            res.status(201).json(await addTodo(todo))
        }
        catch (err) {
            next(err)
        }
    });

    app.patch('/todos/:id', async (req, res, next) => {
        const updates = req.body
        const id = req.params.id
        try {
            res.status(200).json(await updateTodo(id, updates))
        } catch (err) {
            next(err)
        }
    })

    app.patch('/todos/:id/complete', async (req, res, next) => {
        const id = req.params.id
        try {
            res.status(200).json(await completeTodo(id))
        } catch (err) {
            next(err)
        }
    })

    app.patch('/todos/:id/reset', async (req, res, next) => {
        const id = req.params.id
        try {
            res.status(200).json(await resetTodo(id))
        } catch (err) {
            next(err)
        }
    })

    app.delete('/todos/:id', async (req, res, next) => {
        try {
            res.status(200).json(await deleteTodo(req.params.id))
        }
        catch (err) {
            next(err)
        }
    });
}