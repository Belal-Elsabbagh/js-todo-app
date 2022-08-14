let express = require('express');
const configVariables = require('./config/configVariables');
try {
    let database = require('./config/database')
} catch (dbErr) {
    console.log('Failed to connect to MongoDB', err);
    process.exit(1)
}
let appController = require('./controllers/todo-controller')
let bodyParser = require('body-parser')
let app = express()
app.set('view engine', 'ejs')
app.use('/assets', express.static('assets'))
app.use(bodyParser.urlencoded({ extended: false }))
appController(app)
app.listen(configVariables.server.portNumber)