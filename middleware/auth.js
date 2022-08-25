const verifyUserToken = require('./verifyUserToken')
module.exports = async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    try {
        req.tokenData = await verifyUserToken(token);
        next();
    } catch (err) {
        next(err);
    }
}
