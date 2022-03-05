const express = require('express');
const { body } = require('express-validator');

const router = express.Router();

const statusController = require('../controllers/status.controllers.js');

const isAuth = require('../middleware/is-auth.js');

router.get('/status', isAuth, statusController.getStatus);

router.patch(
  '/status',
  isAuth,
  [body('status').trim().isLength({ min: 5 })],
  statusController.updateStatus
);

module.exports = router;
