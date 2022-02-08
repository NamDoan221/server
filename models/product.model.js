const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    image: {type: String, required: true},
    name_product: {type: String, required: true},
    amount: {type: Number, required: true},
    price: {type: Number, required: true},
    producer: {type: String, required: false}
});

const Product = mongoose.model('Product', productSchema, 'product');

module.exports = Product;