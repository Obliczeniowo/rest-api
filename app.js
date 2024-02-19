const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');

const feedRoutes = require('./routes/feed.routes.js');

const mongodbUrl = 'mongodb://localhost:27017';

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    console.log(new Date().getTime() + file.originalname);
    cb(null, 's' + new Date().getTime() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  cb(null, ['image/png', 'image/jpg', 'image/jpeg'].includes(file.type));
};

app.use(bodyParser.json());
app.use(
  multer({
    storage: fileStorage,
    filefilter: fileFilter,
  }).single('image')
);

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-requested-With, Content-Type, Accept'
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    return res.status(200).json({});
  }
  next();
});

app.use('/feed', feedRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode;
  const messages = error.messages;
  res.status(status).json({ message: messages });
});

mongoose
  .connect(mongodbUrl, { dbName: 'messages' })
  .then(() => {
    app.listen(8080);
  })
  .catch((err) => console.log(err));
