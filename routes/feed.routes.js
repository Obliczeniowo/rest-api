const express = require('express');

const feedController = require('../controllers/feed.controllers.js');

const router = express.Router();

// GET /feed/posts
router.get('/posts', feedController.getPosts);

// POST /feed/posts
router.post('/posts', feedController.postPosts);

module.exports = router;