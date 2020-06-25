const mongoose = require('mongoose')
const Schema = mongoose.Schema

let itemSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: false },
  category: { type: String, required: true },
  image: { type: String, required: false },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  enabled: { type: Boolean, default: false },
});

module.exports = itemSchema
