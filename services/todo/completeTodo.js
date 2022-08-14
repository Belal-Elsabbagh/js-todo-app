let taskModel = require('../../models/models').taskModel;
module.exports = async (todoObject) => {
    return await taskModel.updateOne(todoObject, { isCompleted: true, timeCompleted: Date.now() })
}
