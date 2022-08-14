let models = require('../../models/models');
module.exports = async (todoObject) => {
    return await models.taskModel.create(todoObject)
}