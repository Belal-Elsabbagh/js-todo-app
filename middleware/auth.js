const jwt = require("jsonwebtoken");
const { HTTP_STATUS_CODES } = require('./errors')
const { verifyUserToken } = require('../services').userServices
module.exports = async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    try {
        req.user = await verifyUserToken(token);
        next();
    } catch (err) {
        next(err);
    }
}
