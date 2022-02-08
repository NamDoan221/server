const errors = require("../validate/product.validate");
const Product = require('../models/product.model');

module.exports.index = async (req, res) => {
  const products = await Product.find();
  res.render("products/index", {
    products: products
  });
  };

module.exports.search = async (req, res) => {
  let searchQuery = {};
  searchQuery.name_product = {$regex: req.query.q, $options: 'i'};
  let matchedProducts = [];
  if(!req.query.q) {
    matchedProducts = await Product.find();
    res.render("products/index", {
      products: matchedProducts,
    });
    return;
  }

  matchedProducts = await Product.find(searchQuery);
  res.render("products/index", {
    products: matchedProducts,
  });
};

module.exports.getCreate = (req, res) => {
  res.render("products/create");
};

module.exports.create = async (req, res) => {
  const avatar_url = `http://localhost:4200/${req.file.path.split('\\').slice(1).join('/')}`;
  const product = {
    name_product: req.body.name,
    amount: req.body.amount,
    price: req.body.price,
    producer: req.body.producer,
    image: avatar_url
  }

  const productExist = await Product.findOne(product);
  if(productExist) {
    res.send("Product đã tồn tại");
    return;
  }
  Product.insertMany([product]);
  res.redirect("/products");
};

module.exports.getProduct = async (req, res) => {
  const product = await Product.findOne({_id: req.params._id});

  res.render("products/view", {
    product: product,
  });
};

module.exports.getUpdateProduct = async (req, res) => {
  const product = await Product.findOne({_id: req.params._id});
  res.render(`products/update`, {
    product: product,
  });
};

module.exports.updateProduct = async (req, res) => {
  if(errors.errors(req).length) {
    if(!req.file) {
      res.send("hello");
      return;
    }
    const avatar_url = `http://localhost:4200/${req.file.path.split('\\').slice(1).join('/')}`;
    const product = {
      name_product: req.body.name,
      amount: req.body.amount,
      price: req.body.price,
      producer: req.body.producer,
      image: avatar_url
    }
    res.render(`products/update`, {
      errors: errors.errors(req),
      product: product,
    });
    return;
  }
  try {
    if(!req.file) {
      res.send("hello");
      return;
    }
    const avatar_url = `http://localhost:4200/${req.file.path.split('\\').slice(1).join('/')}`;
    await Product.updateOne(
      {_id: req.params._id},
      { $set: { "image": avatar_url ,"name_product" : req.body.name, "amount": req.body.amount, "price": req.body.price, "producer": req.body.producer} },
      { upsert: true }
    );
  } catch (e) {
    return;
  }
  
  res.redirect("/products");
};

module.exports.delete = async (req, res) => {
  await Product.deleteOne({_id: req.params._id});
  res.redirect("/products");
};
