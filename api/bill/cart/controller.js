const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Cart = require('./model');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get('/', async (req, res) => {
  try {
    const cart = await Cart.find({ id_customer: req.query.id_customer });
    res.status(200).send({
      status: 200,
      data: cart && cart.length ? cart[0] : null
    });
  } catch (error) {
    return res.status(500).send({
      status: 500,
      message: 'Có lỗi phát sinh trong server'
    });
  }
});

router.put('/', async (req, res) => {
  try {
    const cartFound = await Cart.find({ id_customer: req.query.id_customer });
    if (cartFound && cartFound.length) {
      const productFound = cartFound[0].products.find(item => item.id === req.body.id);
      if (!productFound) {
        await Cart.findOneAndUpdate({ id_customer: req.query.id_customer }, { "$push": { "products": req.body } }, { upsert: true, returnNewDocument: true });
        return res.status(200).send({
          status: 200,
          data: 'Thao tác thành công'
        });
      }
      productFound.quantily++;
      await Cart.findOneAndUpdate({ id_customer: req.query.id_customer }, { "$set": { products: cartFound[0].products } }, { upsert: true, returnNewDocument: true });
      res.status(200).send({
        status: 200,
        data: 'Thao tác thành công'
      });
    }
  } catch (error) {
    return res.status(500).send({
      status: 500,
      message: 'Có lỗi phát sinh trong server'
    });
  }
});

module.exports = router;