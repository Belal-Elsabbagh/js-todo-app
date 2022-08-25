const { userModel } = require('../models')
const { NotFoundError, IncorrectCredentialsError, InvalidDuplicateError, NotAuthenticatedError } = require('../middleware/errors')
const jsonwebtoken = require('jsonwebtoken')
require('dotenv').config()
const { JWT_SECRET_KEY } = process.env
const MONGODB_DUPLICATE_KEY_ERR_CODE = 11000
class User {
    /**
     * 
     * @param {Object} userObject The user object to add to the database
     * @returns {Object} The data of the user that was created
     */
    addUser = async (userObject) => {
        try {
            return await userModel.create(userObject)
        } catch (err) {
            if (err.code === MONGODB_DUPLICATE_KEY_ERR_CODE) throw new InvalidDuplicateError('Email already exists')
            throw err
        }
    }

    /**
     * 
     * @param {Object} userObject The user object to add to the database
     * @returns {(Object|Boolean)} The data of the user that was created
     */
    runLoginQuery = async (userObject) => {
        let queryResult = await userModel.findOne(userObject)
        if (queryResult === null) return false;
        return queryResult
    }

    userIdExists = async (userId) => {
        let queryResult = await userModel.findById(userId)
        if (queryResult === null) return false;
        return true;
    }

    getUserById = async (userId) => {
        let queryResult = await userModel.findById(userId)
        if (queryResult === null) throw new NotFoundError(`User with id \'${id}\' was not found`);
        return queryResult;
    }

    /**
     * 
     * @param {string} email The user's email to search for
     * @throws {NotFoundError} If the user is not found
     * @returns 
     */
    getUserByEmail = async (email) => {
        let queryResult = await userModel.findOne({ email: email })
        if (queryResult === null) throw new NotFoundError(`User with email \'${email}\' was not found`);
        return queryResult;
    }

    userEmailExists = async (email) => {
        let queryResult = await userModel.findOne({ email: email })
        if (queryResult === null) return false;
        return true
    }

    getUsers = async () => {
        return await userModel.find({})
    }

    getLoginResult = async (user) => {
        try {
            let result = await this.runLoginQuery(user);
            if (result === false) throw new IncorrectCredentialsError('Incorrect Credentials to login');
            return result;
        } catch (err) {
            throw err
        }
    }

    deleteUser = async (userId) => {
        try {
            await this.getUserById(userId)
            return await userModel.findByIdAndDelete(userId)
        } catch (err) {
            throw err
        }
    }

    login = async (user) => {
        try {
            let loggedInUser = await this.getLoginResult(user);
            let token = await this.generateUserToken(loggedInUser)
            return token
        } catch (err) {
            throw err
        }
    }

    generateUserToken = async (userObject) => {
        try {
            let data = {
                user: {
                    email: userObject.email,
                    role: userObject.role
                }, time: Date.now()
            }
            return jsonwebtoken.sign(data, JWT_SECRET_KEY, { expiresIn: "1h" })
        } catch (err) {
            throw err
        }
    }
}

module.exports = new User();