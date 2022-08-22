let mongoose = require('mongoose')
module.exports = mongoose.model('users',new mongoose.Schema({
    username: String,
    email: String,
    password: String
}))