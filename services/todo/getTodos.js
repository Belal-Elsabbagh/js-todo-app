let models = require('../../models/models');
module.exports = async () => {
    return await models.taskModel.find({})
}
