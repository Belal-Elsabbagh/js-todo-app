let mongoose = require('mongoose')
module.exports = mongoose.model('users',new mongoose.Schema({
    email: String,
    password: String
}))