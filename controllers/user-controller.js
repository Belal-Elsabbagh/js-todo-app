const validate = require('../validation/validate')
const { signupSchema, loginSchema } = require('../validation/schemas/')
const { addUser, deleteUser, getUsers, getUserByEmail, login, generateToken } = require('../services/').userServices

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
            let result = await getUserByEmail(req.params.email)
            res.status(200).json(result)
        }
        catch (err) {
            next(err)
        }
    });

    app.post('/user/signup', async (req, res, next) => {
        try {
            let user = await validate(signupSchema, req.body);
            res.status(201).json(await addUser(user));
        }
        catch (err) {
            next(err)
        }
    });

    app.post('/user/login', async (req, res, next) => {
        try {
            let user = await validate(loginSchema, req.body);
            let userToken = await login(user)
            res.status(200).json(userToken);
        }
        catch (err) {
            next(err)
        }
    })

    app.post('/user/generateToken/:userId', async (req, res, next) => {
        try {
            const userId = req.params.userId
            res.status(200).send(await generateToken(userId))
        } catch(err) {
            next(err)
        }
    })

    app.delete('/user/:userId', async (req, res, next) => {
        try {
            const userId = req.params.userId
            res.status(200).json(await deleteUser(userId))
        } catch(err) {
            next(err)
        }
    })
}