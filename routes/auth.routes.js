const express = require('express');
const { body } = require('express-validator');

const User = require('../models/user.model');

const router = express.Router();

const authController = require('../controllers/auth.controllers.js');

router.put(
  '/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter email address')
      .normalizeEmail()
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject('E-mail exist');
          }
        });
      }),
    body('password').trim().isLength({ min: 5 }),
    body('name').trim().notEmpty(),
  ],
  authController.signup
);

router.post('/login', authController.login);

module.exports = router;
