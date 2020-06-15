const mongoose = require('mongoose')
const UserSchema = require('./schemas/users')
const UserModel = mongoose.model('user', UserSchema)

module.exports = UserModel


