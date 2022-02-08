const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    user_name: String,
    pass_word: String,
    id_customer: String,
    name: String
});

const User = mongoose.model('User', userSchema, 'user');

module.exports = User;