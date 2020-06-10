const mongoose = require('mongoose')
const Schema = mongoose.Schema

let userSchema = new Schema({
  firstname: { type: String, required: false, unique: true },
  lastname: { type: String, required: false, unique: true },
  email: { type: String, required: true, unique: true },
  rol: { type: String, required: false, default: 'user' },
  password: { type: String, required: true , default: 'password' },
  _id: {type: String, required: true},
  enabled: { type: Boolean, default: false },
});

module.exports = userSchema
