require("dotenv").config();
import express from 'express';
import todoController from './controllers/todo-controller';
import userController from './controllers/user-controller';
import errorHandler from './middleware/errors';
import bodyParser from 'body-parser';
import verifyToken from './middleware/auth';
import databaseConnection from './config/database';
const { API_PORT } = process.env
let app = express()
try {
    app.use('/assets', express.static('assets'))
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use('/todos', verifyToken) // Deactivate to test the api without authentication
    console.log(`Successfully connected to ${databaseConnection}`);
    todoController(app)
    userController(app)
    app.use(errorHandler)
    app.listen(API_PORT)
    console.log(`Server started on port ${API_PORT}`)
} catch (err) {
    console.log(err);
    process.exit(1)
}
export default app