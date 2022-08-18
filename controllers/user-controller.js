const validate = require('../validation/validate')
const {signupSchema, loginSchema} = require('../validation/schemas/')
const {addUser, getUsers, getUserByEmail, login} = require('../services/').userServices
module.exports = (app) => {
    app.get('/user', async (req, res, next) => {
        try {
            res.status(200).json(await getUsers())
        }
        catch (err) {
            next(err)
        }
    });

    app.get('/user/:email', async (req, res, next) => {
        try {
            let result = getUserByEmail(req.params.email)
            res.status(200).json(result)
        }
        catch (err) {
            next(err)
        }
    });

    app.post('/signup', async (req, res, next) => {
        try {
            let user = await validate(signupSchema, req.body);
            res.status(201).json(await addUser(user));
        }
        catch (err) {
            next(err)
        }
    });

    app.post('/login', async (req, res, next) => {
        try {
            let user = await validate(loginSchema, req.body);
            res.status(200).json(await login(user));
        }
        catch (err) {
            next(err)
        }
    })
}