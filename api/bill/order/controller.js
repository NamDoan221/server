const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Order = require('./model');
const Cart = require('../cart/model');
const verifyToken = require('../../../middleware/verify-token');
const moment = require('moment');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get('/', verifyToken, async (req, res) => {
  const searchQuery = {
    name: { $regex: req.query.search || '', $options: 'i' },
    ...req.query
  };
  const searchQueryCustomerName = {
    name_customer: { $regex: req.query.search || '', $options: 'i' },
    ...req.query
  };
  try {
    const orders = await Order.find(searchQuery);
    const orders2 = await Order.find(searchQueryCustomerName);
    if (!orders && !orders2) {
      return res.status(200).send({
        status: 200,
        data: []
      });
    }
    let newOrder = orders;
    orders2.forEach(order => {
      if (!newOrder.find(item => String(item._id) === String(order._id))) {
        newOrder.push(order);
      }
    })
    res.status(200).send({
      status: 200,
      data: newOrder
    });
  } catch (error) {
    return res.status(500).send({
      status: 500,
      message: 'Có lỗi phát sinh trong server'
    });
  }
});

router.post('/', verifyToken, async (req, res) => {
  try {
    const orderData = {
      ...req.body,
      preparation_time: moment().add(3, 'days').format(),
      delivery_time: moment().add(8, 'days').format(),
    }
    const order = await Order.create(orderData);
    const cartFound = await Cart.find({ id_customer: req.body.id_customer });
    const product = cartFound[0].products.filter(item => !req.body.products.find(ele => ele.id === item.id));
    await Cart.findOneAndUpdate({ id_customer: req.body.id_customer }, { "$set": { products: product } }, { upsert: true, returnNewDocument: true });
    res.status(200).send({
      status: 200,
      data: order
    });
  } catch (error) {
    return res.status(500).send({
      status: 500,
      message: 'Có lỗi phát sinh trong server'
    });
  }
});

router.put('/', verifyToken, async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate({ _id: req.query.id }, { $set: req.body }, { sort: { name: 1 }, upsert: true, returnNewDocument: true });
    if (!order) {
      return res.status(404).send({
        status: 404,
        message: 'Đơn hàng không tồn tại'
      });
    }
    res.status(200).send({
      status: 200,
      data: order
    });
  } catch (error) {
    return res.status(500).send({
      status: 500,
      message: 'Có lỗi phát sinh trong server'
    });
  }
});

module.exports = router;