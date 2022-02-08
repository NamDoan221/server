const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Order = require('./model');
const verifyToken = require('../../../middleware/verify-token');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get('/', verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ id_customer: req.query.id_customer });
    if (!orders) {
      return res.status(200).send({
        status: 200,
        data: []
      });
    }
    res.status(200).send({
      status: 200,
      data: orders
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
    const order = await Order.create(req.body);
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
      message: order
    });
  } catch (error) {
    return res.status(500).send({
      status: 500,
      message: 'Có lỗi phát sinh trong server'
    });
  }
});

module.exports = router;