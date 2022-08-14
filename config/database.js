let mongoose = require("mongoose");
const dbConfig = require('./configVariables').db
mongoose.connect(dbConfig.uri).then(() => {
    module.exports.databaseConnection = mongoose.connection
    console.log('Database connection successful!');
}).catch(err => {
    throw err 
});
