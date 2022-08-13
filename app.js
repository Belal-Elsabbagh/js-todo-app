let express = require('express');
let database = require('./config/database')
let appController = require('./controllers/app-controller')
let app = express()
app.set('view engine', 'ejs')
app.use('/assets', express.static('assets'))
appController(app)
app.listen(3000)