'use strict'
/**
 * Module Dependencies
 */
const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

let productSchema = new Schema({
  product: {
    type: String,
    default: '',
    index: true,
    unique: true
  },
  price: {
    type: Number,
    default: ''
  },
  quantity: {
    type: Number,
    default: ''
  },
  image: {
    type: String,
    default: ''
  }
})


mongoose.model('Products', productSchema,'productsCollection');