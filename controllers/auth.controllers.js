const User = require('../models/user.model');
const bcrypt = require('bcrypt');

const { validationResult } = require('express-validator');

const { errorCb, getError } = require('../utils/errors.js');

exports.signup = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw getError('Validation fail', 422);
  }

  bcrypt
    .hash(req.body.password, 12)
    .then((password) => {
      const user = new User(
          {
              ...req.body,
              password: password
          }
      );

      return user.save();
    }).then(result => {
        res.status(201).json({ userId: result._id })
    })
    .catch((error) => {
      return errorCb(error);
    });
};
