const jwt = require("jsonwebtoken");
const { HTTP_STATUS_CODES } = require('./errors')
const { JWT_SECRET_KEY } = process.env;
module.exports.verifyToken = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) return res.status(HTTP_STATUS_CODES.Forbidden).send("A token is required for authentication");
    try {
        const decoded = jwt.verify(token, JWT_SECRET_KEY);
        req.activeUser = decoded;
    } catch (err) {
        return res.status(HTTP_STATUS_CODES.Unauthorized).send("Invalid Token");
    }
    return next();
}