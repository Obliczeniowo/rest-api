exports.errorCb = (err, next) => {
    if (!err.statusCode) {
        err.statusCode = 500;
    }
    return next(err);
};

exports.getError = (message, code) => {
    const err = new Error(message);
    err.statusCode = code;
    return err;
};