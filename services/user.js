const { userModel } = require('../models/models')

class User {
    /**
     * 
     * @param {Object} userObject The user object to add to the database
     * @returns {Object} The data of the user that was created
     */
    addUser = async (userObject) => {
        return await userModel.create(userObject)
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

    getUsers = async () => {
        return await userModel.find({})
    }
}

module.exports = new User()