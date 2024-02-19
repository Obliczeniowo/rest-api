const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  let token = req.get('Authorization');
  token = token && token.split(' ')[1];

  if (!token) {
    req.isAuth = false;
    return next();
  }

  let decodeToken;
  try {
    decodeToken = jwt.decode(token, 'secret');
  } catch (err) {
    req.isAuth = false;
    return next();
  }
  if (!decodeToken) {
    req.isAuth = false;
    return next();
  }

  req.userId = decodeToken.userId;
  req.isAuth = true;
  next();
};
