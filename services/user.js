const { userModel } = require('../models/models')
const crypto = require('crypto')
const { NotFoundError, IncorrectCredentialsError, InvalidDuplicateError } = require('../middleware/errors')
class User {
    /**
     * 
     * @param {Object} userObject The user object to add to the database
     * @returns {Object} The data of the user that was created
     */
    addUser = async (userObject) => {
        try {
            if(await this.userEmailExists(userObject.email)) throw new InvalidDuplicateError('Email already exists')
            userObject.password = this.#hashPassword(userObject.password)
            return await userModel.create(userObject)
        } catch (err) {
            throw err
        }
    }

    #hashPassword(password){
        return crypto.createHash('sha256').update(password).digest('hex')
    }

    /**
     * 
     * @param {Object} userObject The user object to add to the database
     * @returns {Object} The data of the user that was created
     */
    getUser = async (userObject) => {
        return await userModel.findOne(userObject)
    }

    /**
     * 
     * @param {string} email The user's email to search for
     * @throws {NotFoundError} If the user is not found
     * @returns 
     */
    getUserByEmail = async (email) => {
        let queryResult = await userModel.findOne({ email: email })
        if (queryResult === null) throw new NotFoundError(`User with email ${email} was not found`);
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

    login = async (user) => {
        user.password = this.#hashPassword(user.password)
        let result = await this.getUser(user);
        if (!result) throw new IncorrectCredentialsError('Incorrect Credentials to login');
        return result;
    }
}

module.exports = new User()