const User = require('../models/user.model');
const bcrypt = require('bcrypt');

const { validationResult } = require('express-validator');

const { errorCb, getError } = require('../utils/errors.js');
const { is } = require('express/lib/request');

exports.signup = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw getError('Validation fail', 422);
  }

  bcrypt
    .hash(req.body.password, 12)
    .then((password) => {
      const user = new User({
        ...req.body,
        password: password,
      });

      return user.save();
    })
    .then((result) => {
      res.status(201).json({ userId: result._id });
    })
    .catch((error) => {
      return errorCb(error);
    });
};

exports.login = (req, res, next) => {
  let loadedUser;
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        throw getError('Email cant be find', 401);
      }

      loadedUser = user;

      bcrypt.compare(req.body.password, user.password);
    })
    .then(isEqual => {
        if (!isEqual) {
            throw getError('Bad password', 401);
        }
    })
    .catch((error) => {
      errorCb(error);
    });
};
