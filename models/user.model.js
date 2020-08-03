const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { v4: uuid } = require('uuid');

const UserSchema = new Schema({
  id: {
    type: String,
    // default: () => uuid(),
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  }
}, {
  timestamps: true,
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
