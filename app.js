const express = require('express');
const { todoController, userController } = require('./controllers');
const { errorHandler } = require('./middleware/errors')
const bodyParser = require('body-parser')
const configVariables = require('./config/configVariables');
try {
    let app = express()
    app.use('/assets', express.static('assets'))
    app.use(bodyParser.urlencoded({ extended: false }))
    let database = require('./config/database')
    todoController(app)
    userController(app)
    app.use(errorHandler)
    app.listen(configVariables.server.portNumber)
} catch (err) {
    console.log(err);
    process.exit(1)
}
