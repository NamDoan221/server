const mongoose = require('mongoose');
const OrderSchema = new mongoose.Schema({
  name: String,
  id_customer: String,
  name_customer: String,
  status: Number,
  totalMoney: Number,
  products: [{
    id: String,
    quantily: Number,
    name: String
  }]
});
mongoose.model('Order', OrderSchema);

module.exports = mongoose.model('Order');