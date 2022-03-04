const express = require('express');

const feedController = require('../controllers/feed.controllers.js');

const router = express.router();

// GET /feed/posts
router.get('/posts', feedController.getPosts);

module.exports = router;