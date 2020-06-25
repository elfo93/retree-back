const mongoose = require('mongoose')
const Schema = mongoose.Schema

let userSchema = new Schema({
  firstname: { type: String, required: false, unique: false },
  lastname: { type: String, required: false, unique: false },
  email: { type: String, required: true, unique: false },
  password: { type: String, required: true , default: 'password' },
  address: {type: String, required: false, unique: false},
  phone:  {type: Number, required: false, unique: false},
  rol: { type: String, required: false, default: 'user' },
  _id: {type: String, required: true},
  enabled: { type: Boolean, default: false },
});

module.exports = userSchema
