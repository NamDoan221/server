const mongoose = require('mongoose');  
const UserSchema = new mongoose.Schema({  
  name: String,
  email: String,
  password: String,
  address: String,
  avatar: String,
  isAdmin: Boolean,
  phone_number: String
});
mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');