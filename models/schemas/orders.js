const mongoose = require('mongoose')
const Schema = mongoose.Schema

let itemSchema = new Schema({

  products: [{
    title: { type: String, required: true },
    description: { type: String, required: false },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    category: { type: String, required: true },
  }],
  user_id: "",
  total: { type: Number, required: false },
  status: { type: Number, default: 1 },
  created_at: { type: Date, default: Date.now },
  shipped_at: { type: Date, required: false },
});

module.exports = itemSchema
