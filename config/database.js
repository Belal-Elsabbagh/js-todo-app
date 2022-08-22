let mongoose = require("mongoose");
const { MONGODB_URI } = process.env;

const connectToDb = async () => {
    try {
        await mongoose.connect(MONGODB_URI)
        return mongoose.connection
    } catch (err) {
        throw err
    }
}

module.exports = connectToDb()