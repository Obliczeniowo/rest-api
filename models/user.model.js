const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: 'string',
    required: true,
  },
  email: {
    type: 'string',
    required: true,
  },
  password: {
    type: 'string',
    required: true,
  },
  status: {
    type: 'string',
    required: true,
  },
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
});

module.exports = mongoose.model('User', userSchema);
