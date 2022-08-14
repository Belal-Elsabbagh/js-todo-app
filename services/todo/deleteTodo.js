let taskModel = require('../../models/models').taskModel;
module.exports = async (todoObject) => {
    return await taskModel.deleteOne(todoObject)
}