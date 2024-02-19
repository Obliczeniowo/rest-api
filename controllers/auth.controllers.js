const User = require('../models/user.model');

const { validationResult } = require('express-validator');

const { errorCb, getError } = require('../utils/errors.js');

exports.signup = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        throw getError('Validation fail', 422);
    }

    

}