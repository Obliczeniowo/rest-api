const express = require('express');

const feedRoutes = require('./controllers/feed.controllers.js');

const app = express();

app.use(feedRoute, feedRoutes);

app.listen(8080);

