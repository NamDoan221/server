const mongoose = require('mongoose');


const customerSchema = new mongoose.Schema({
    customer_name: {type: String, required: true},
    age: {type: Number, required: true},
    address: {type: String, required: true},
    phone_number: {type: String, required: true},
    cart: {type: Array, required: false},
    avatar: {type: String, required: true}

});

const Customer = mongoose.model('Customer', customerSchema, 'customer');

module.exports = Customer;