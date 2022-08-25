const { JWT_SECRET_KEY } = process.env;
const jsonwebtoken = require("jsonwebtoken");
const { NotAuthenticatedError } = require("../middleware/errors");
module.exports = async (userToken) => {
    try {
        let data = jsonwebtoken.verify(userToken, JWT_SECRET_KEY);
        return data;
    } catch (err) {
        throw new NotAuthenticatedError("A token is required for authentication")
    }
}