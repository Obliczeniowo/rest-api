const User = require('../models/user.model');

const { validationResult } = require('express-validator');

const { errorCb, getError } = require('../utils/errors.js');

exports.getStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      throw getError('User not exist');
    }
    res.status(200).json({ status: user.status });
  } catch (err) {
    return errorCb(err, next);
  }
};

exports.updateStatus = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw getError('Something went wrong!', 422);
  }

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      throw getError('User not exist');
    }
    user.status = req.body.status;
    await user.save();
    res.status(200).json({ message: 'Updated' });
  } catch (err) {
    return errorCb(err, next);
  }
};
