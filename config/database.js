let mongoose = require("mongoose");

/**
 * URI that connects to the database
*/
const DATABASE_CONNECTION_URI = 'mongodb://localhost:27017/todo-list'
mongoose.connect(DATABASE_CONNECTION_URI);
console.log("Database Connection Successful")
module.exports.databaseConnection = mongoose.connection
