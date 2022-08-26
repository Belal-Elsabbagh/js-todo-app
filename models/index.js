require("dotenv").config();
let mongoose = require("mongoose");
const { MONGODB_URI } = process.env

const connectToDb = () => {
    try {
        mongoose.connect(MONGODB_URI)
        return mongoose.connection
    } catch (err) {
        throw err
    }
}

connectToDb()

module.exports = {
    userModel: require('./userModel'),
    todoModel: require('./todoModel'),
}