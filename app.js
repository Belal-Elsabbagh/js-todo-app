const express = require('express');
const todoController = require('./controllers/todo-controller')
const userController = require('./controllers/user-controller')
const BaseError = require('./middleware/errors').BaseError
const bodyParser = require('body-parser')
const configVariables = require('./config/configVariables');
try {
    let app = express()
    app.set('view engine', 'ejs')
    app.use('/assets', express.static('assets'))
    app.use(bodyParser.urlencoded({ extended: false }))
    let database = require('./config/database')
    todoController(app)
    userController(app)
    app.use((err, req, res, next) => {
        if (!(err instanceof BaseError)) {
            next(err);
            return;
        }
        res.status(err.code).json({
            message: err.message,
            code: err.code
        });
    })
    app.listen(configVariables.server.portNumber)
} catch (err) {
    console.log(err);
    process.exit(1)
}
