const mongoose = require('mongoose');
//productSchema code defines a property in the documents that will be added to the MongoDB database
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
    trim: true,
  },
  price:{
    type:Number,
  },
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;