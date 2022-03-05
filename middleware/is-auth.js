const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  let token = req.get('Authorization');
  token = token && token.split(' ')[1];

  let decodeToken;
  try {
    decodeToken = jwt.verify(token, 'secret');
  } catch (err) {
    err.statusCode = 400;
    throw err;
  }
  if (!decodeToken) {
    const err = new Error('');
    err.statusCode = 401;
    throw error;
  }

  req.userId = decodeToken.userId;
  next();
};
