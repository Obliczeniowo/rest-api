const User = require('../models/user.model');

const { validationResult } = require('express-validator');

const { errorCb, getError } = require('../utils/errors.js');

exports.getStatus = (req, res, next) => {
  return User.findById(req.userId)
    .then((user) => {
      if (!user) {
        throw getError('User not exist');
      }
      res.status(200).json({ status: user.status });
    })
    .catch((err) => {
      return errorCb(err, next);
    });
};

exports.updateStatus = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw getError('Something went wrong!', 422);
  }

  return User.findById(req.userId)
    .then((user) => {
      if (!user) {
        throw getError('User not exist');
      }
      user.status = req.body.status;
      return user.save();
    })
    .then(() => {
      res.status(200).json({ message: 'Updated' });
    })
    .catch((err) => {
      return errorCb(err, next);
    });
};
