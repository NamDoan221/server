const express = require('express');
const app = express();
require('./database');
const cors = require('cors');
app.use(cors());

app.use('/api/auth', require('./api/auth/controller'));
app.use('/api/users', require('./api/user/controller'));
app.use('/api/product', require('./api/product-library/product/controller'));
app.use('/api/category', require('./api/product-library/category/controller'));
app.use('/api/cart', require('./api/bill/cart/controller'));
app.use('/api/order', require('./api/bill/order/controller'));

module.exports = app;