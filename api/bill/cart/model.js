const mongoose = require('mongoose');  
const CartSchema = new mongoose.Schema({
  id_customer: String,
  products: [{
    id: String,
    name: String,
    image: String,
    price: Number,
    quantily: Number
  }]
});
mongoose.model('Cart', CartSchema);

module.exports = mongoose.model('Cart');