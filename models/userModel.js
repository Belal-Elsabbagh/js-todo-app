let mongoose = require('mongoose')
let crypto = require('crypto')

const hashPassword = (password) => {
    return crypto.createHash('sha256').update(password).digest('hex')
}

let userSchema = new mongoose.Schema({
    username: String,
    email: String,
    role: { type: String, default: 'user' },
    password: String
})

userSchema.pre('save', function(next) {
    const user = this
    let hashedPassword = hashPassword(user.password)
    if (user.isModified('password')) user.password = hashedPassword
    //console.log(this)
    next()
})

userSchema.pre('findOne', function(next) {
    let userPassword = this._conditions.password
    if(this._conditions.hasOwnProperty('password')) this._conditions.password = hashPassword(userPassword)
    next()
})

module.exports = mongoose.model('users', userSchema)