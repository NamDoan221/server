const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Product = require('./model');
const verifyToken = require('../../../middleware/verify-token');
const pagination = require('../../../middleware/pagination');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get('/', pagination, async (req, res) => {
  const searchQuery = {
    name: { $regex: req.query.search || '', $options: 'i' },
    category: req.query.category
  };
  try {
    const products = await Product.find(searchQuery).skip(req.skip).limit(req.limit);
    res.status(200).send({
      status: 200,
      data: products
    });
  } catch (error) {
    return res.status(500).send({
      status: 500,
      message: 'Có lỗi phát sinh trong server'
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send({
        status: 404,
        message: 'Sản phẩm không tồn tại'
      });
    }
    res.status(200).send({
      status: 200,
      data: product
    });
  } catch (error) {
    return res.status(500).send({
      status: 500,
      message: 'Có lỗi phát sinh trong server'
    });
  }
});

router.post('/add', verifyToken, async (req, res) => {
  if (!req.isAdmin) {
    return res.status(401).send({
      status: 401,
      message: 'Bạn không có quyền truy cập chức năng này'
    });
  }
  try {
    const product = await Product.create(req.body);
    res.status(200).send({
      status: 200,
      data: product
    });
  } catch (error) {
    return res.status(500).send({
      status: 500,
      message: 'Có lỗi phát sinh trong server'
    });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  if (!req.isAdmin) {
    return res.status(401).send({
      status: 401,
      message: 'Bạn không có quyền truy cập chức năng này'
    });
  }
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id });
    if (!product) {
      return res.status(404).send({
        status: 404,
        message: 'Sản phẩm không tồn tại'
      });
    }
    res.status(200).send({
      status: 200,
      message: 'Thao tác thành công'
    });
  } catch (error) {
    return res.status(500).send({
      status: 500,
      message: 'Có lỗi phát sinh trong server'
    });
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  if (!req.isAdmin) {
    return res.status(401).send({
      status: 401,
      message: 'Bạn không có quyền truy cập chức năng này'
    });
  }
  try {
    const product = await Product.findOneAndUpdate({ _id: req.params.id }, { $set: req.body }, { sort: { name: 1 }, upsert: true, returnNewDocument: true });
    if (!product) {
      return res.status(404).send({
        status: 404,
        message: 'Sản phẩm không tồn tại'
      });
    }
    res.status(200).send({
      status: 200,
      message: 'Thao tác thành công'
    });
  } catch (error) {
    return res.status(500).send({
      status: 500,
      message: 'Có lỗi phát sinh trong server'
    });
  }
});

module.exports = router;