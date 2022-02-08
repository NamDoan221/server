const mongoose = require('mongoose');


const employeeSchema = new mongoose.Schema({
    employee_name: {type: String, required: true},
    address: {type: String, required: true},
    phone_number: {type: String, required: true},
    regency: {type: String, required: false},
    salary: {type: Number, required: false},
    age: {type: Number, required: false}
});

const Employee = mongoose.model('Employee', employeeSchema, 'employee');

module.exports = Employee;