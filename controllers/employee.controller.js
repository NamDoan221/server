const errors = require("../validate/customer.validte");
const Employee = require('../models/employee.model');

module.exports.index = async (req, res) => {
  const employees = await Employee.find();
  res.render("employees/index", {
    employees: employees
  });
  };

module.exports.search = async (req, res) => {
  let searchQuery = {};
  searchQuery.employee_name = {$regex: req.query.q, $options: 'i'};
  let matchedEmployees = [];
  if(!req.query.q) {
    matchedEmployees = await Employee.find();
    res.render("employees/index", {
        employees: matchedEmployees
    });
    return;
  }

  matchedEmployees = await Employee.find(searchQuery);
  res.render("employees/index", {
    employees: matchedEmployees
  });
};

module.exports.getCreate = (req, res) => {
  res.render("employees/create");
};

module.exports.create = async (req, res) => {
  const employee = {
    employee_name: req.body.name,
    address: req.body.address,
    phone_number: req.body.phone,
    regency: req.body.regency,
    salary: req.body.salary,
    age: req.body.age
  }

  const employeeExist = await Employee.findOne(employee);
  if(employeeExist) {
    res.send("Employee đã tồn tại");
    return;
  }
  Employee.insertMany([employee]);
  res.redirect("/employees");
};

module.exports.getEmployee = async (req, res) => {
  const employee = await Employee.findOne({_id: req.params._id});

  res.render("employees/view", {
    employee: employee,
  });
};

module.exports.getUpdateEmployee = async (req, res) => {
  const employee = await Employee.findOne({_id: req.params._id});
  res.render(`employees/update`, {
    employee: employee,
  });
};

module.exports.updateEmployee = async (req, res) => {
  if(errors.errors(req).length) {

    const employee = {
        employee_name: req.body.name,
        address: req.body.address,
        phone_number: req.body.phone,
        regency: req.body.regency,
        salary: req.body.salary,
        age: req.body.age
    }
    res.render(`employees/update`, {
      errors: errors.errors(req),
      employee: employee,
    });
    return;
  }
  try {
    await Employee.updateOne(
      {_id: req.params._id},
      { $set: { "employee_name" : req.body.name, "address": req.body.address, "phone_number": req.body.phone, "regency": req.body.regency, "salary": req.body.salary, "age": req.body.age} },
      { upsert: true }
    );
  } catch (e) {
    return;
  }
  
  res.redirect("/employees");
};

module.exports.delete = async (req, res) => {
  await Employee.deleteOne({_id: req.params._id});
  res.redirect("/employees");
};
