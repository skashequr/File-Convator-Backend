const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

const SingleUser = mongoose.model('User');

module.exports = SingleUser;
