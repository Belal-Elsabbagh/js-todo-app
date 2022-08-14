const express = require('express');
const todoController = require('./controllers/todo-controller')
const bodyParser = require('body-parser')
const configVariables = require('./config/configVariables');
try {
    let app = express()
    app.set('view engine', 'ejs')
    app.use('/assets', express.static('assets'))
    app.use(bodyParser.urlencoded({ extended: false }))
    let database = require('./config/database')
    todoController(app)
    app.listen(configVariables.server.portNumber)
} catch (err) {
    console.log(err);
    process.exit(1)
}
