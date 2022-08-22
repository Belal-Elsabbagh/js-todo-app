let mongoose = require("mongoose");
const { MONGODB_URI } = process.env;
mongoose.connect(MONGODB_URI).then(() => {
    module.exports.databaseConnection = mongoose.connection
    console.log(`Successfully connected to ${MONGODB_URI}`);
}).catch(err => { throw err });
