const validate = require('../validation/validate')
const { todoSchema } = require('../validation/schemas');
const { ValidationError, ForbiddenError } = require('../middleware/errors');
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
const authorizationSchema = require('../auth/index');
module.exports = (app) => {

    app.get('/todos', async (req, res) => {
        if (!authorizationSchema.can(req.tokenData.user.role).readAny('todo').granted)
            throw new ForbiddenError('You are not allowed to read todos')
        res.status(200).json(await getAllTodos());
    });

    app.get('/todos/:id', async (req, res, next) => {
        try {
            if (!authorizationSchema.can(req.tokenData.user.role).readAny('todo').granted)
                throw new ForbiddenError('You are not allowed to read todos')
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
            if (!authorizationSchema.can(req.tokenData.user.role).readAny('todo').granted)
                throw new ForbiddenError('You are not allowed to read todos')
            let filter = { isCompleted: (req.params.isDone === 'true') };
            res.status(200).json(await getTodos(filter))
        } catch (err) {
            next(err)
        }
    });

    app.post('/todos', async (req, res, next) => {
        try {
            if (!authorizationSchema.can(req.tokenData.user.role).createAny('todo').granted)
                throw new ForbiddenError('You are not allowed to create todos')
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
            if (!authorizationSchema.can(req.tokenData.user.role).updateAny('todo').granted)
                throw new ForbiddenError('You are not allowed to update todos')
            res.status(200).json(await updateTodo(id, updates))
        } catch (err) {
            next(err)
        }
    })

    app.patch('/todos/:id/complete', async (req, res, next) => {
        const id = req.params.id
        try {
            if (!authorizationSchema.can(req.tokenData.user.role).updateAny('todo').granted)
                throw new ForbiddenError('You are not allowed to update todos')
            res.status(200).json(await completeTodo(id))
        } catch (err) {
            next(err)
        }
    })

    app.patch('/todos/:id/reset', async (req, res, next) => {
        const id = req.params.id
        try {
            if (!authorizationSchema.can(req.tokenData.user.role).updateAny('todo').granted)
                throw new ForbiddenError('You are not allowed to update todos')
            res.status(200).json(await resetTodo(id))
        } catch (err) {
            next(err)
        }
    })

    app.delete('/todos/:id', async (req, res, next) => {
        try {
            if (!authorizationSchema.can(req.tokenData.user.role).deleteAny('todo').granted)
                throw new ForbiddenError('You are not allowed to delete todos')
            res.status(200).json(await deleteTodo(req.params.id))
        }
        catch (err) {
            next(err)
        }
    });
}