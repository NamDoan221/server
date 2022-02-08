const mongoose = require('mongoose');  
const ProductSchema = new mongoose.Schema({  
  name: String,
  description: String,
  image: String,
  imageDes: [String],
  category: String,
  price: Number,
  related_product: String,
  inventory: Number,
  supplier: String
});
mongoose.model('Product', ProductSchema);

module.exports = mongoose.model('Product');