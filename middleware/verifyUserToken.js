const {JWT_SECRET_KEY} = process.env;
const jsonwebtoken = require("jsonwebtoken");
const {NotAuthenticatedError} = require("../middleware/errors");
module.exports = async (userToken) => {
    try {
        return jsonwebtoken.verify(userToken, JWT_SECRET_KEY);
    } catch (err) {
        throw new NotAuthenticatedError("A token is required for authentication")
    }
}