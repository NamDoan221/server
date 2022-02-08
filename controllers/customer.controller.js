const errors = require("../validate/customer.validte");
const Customer = require('../models/customer.model');

module.exports.index = async (req, res) => {
  const customers = await Customer.find();
  res.render("customers/index", {
    customers: customers
  });
  };

module.exports.search = async (req, res) => {
  let searchQuery = {};
  searchQuery.customer_name = {$regex: req.query.q, $options: 'i'};
  let matchedCustomers = [];
  if(!req.query.q) {
    matchedCustomers = await Customer.find();
    res.render("customers/index", {
      customers: matchedCustomers,
    });
    return;
  }

  matchedCustomers = await Customer.find(searchQuery);
  res.render("customers/index", {
    customers: matchedCustomers,
  });
};

module.exports.getCreate = (req, res) => {
  res.render("customers/create");
};

module.exports.create = async (req, res) => {
  const avatar_url = `http://localhost:4200/${req.file.path.split('\\').slice(1).join('/')}`;
  const customer = {
    customer_name: req.body.name,
    age: req.body.age,
    address: req.body.address,
    phone_number: req.body.phone,
    cart: [],
    avatar: avatar_url
  }

  const customerExist = await Customer.findOne(customer);
  if(customerExist) {
    res.send("Customer đã tồn tại");
    return;
  }
  Customer.insertMany([customer]);
  res.redirect("/customers");
};

module.exports.getCustomer = async (req, res) => {
  const customer = await Customer.findOne({_id: req.params._id});

  res.render("customers/view", {
    customer: customer,
  });
};

module.exports.getUpdateCustomer = async (req, res) => {
  const customer = await Customer.findOne({_id: req.params._id});
  res.render(`customers/update`, {
    customer: customer,
  });
};

module.exports.updateCustomer = async (req, res) => {
  if(errors.errors(req).length) {
    if(!req.file) {
      res.send("hello");
      return;
    }
    const avatar_url = `http://localhost:4200/${req.file.path.split('\\').slice(1).join('/')}`;
    const customer = {
      customer_name: req.body.name,
      age: req.body.age,
      address: req.body.address,
      phone_number: req.body.phone,
      cart: [],
      avatar: avatar_url
    }
    res.render(`customers/update`, {
      errors: errors.errors(req),
      customer: customer,
    });
    return;
  }
  try {
    if(!req.file) {
      res.send("hello");
      return;
    }
    const avatar_url = `http://localhost:4200/${req.file.path.split('\\').slice(1).join('/')}`;
    await Customer.updateOne(
      {_id: req.params._id},
      { $set: { "avatar": avatar_url ,"customer_name" : req.body.name, "address": req.body.address, "phone_number": req.body.phone, "age": req.body.age} },
      { upsert: true }
    );
  } catch (e) {
    return;
  }
  
  res.redirect("/customers");
};

module.exports.delete = async (req, res) => {
  await Customer.deleteOne({_id: req.params._id});
  res.redirect("/customers");
};
