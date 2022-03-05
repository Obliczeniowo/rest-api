const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const feedRoutes = require('./routes/feed.routes.js');

const mongodbUrl = 'mongodb://localhost:27017';

const app = express();

app.use(bodyParser.json());

app.user('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-requested-With, Content-Type, Accept'
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE');
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
