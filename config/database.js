let mongoose = require("mongoose");
const { uri } = require('./configVariables').db
mongoose.connect(uri).then(() => {
    module.exports.databaseConnection = mongoose.connection
    console.log(`Successfully connected to ${uri}`);
}).catch(err => { throw err });
