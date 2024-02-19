const express = require('express');
const { body } = require('express-validator');

const feedController = require('../controllers/feed.controllers.js');

const router = express.Router();

// GET /feed/posts
router.get('/posts', feedController.getPosts);

// POST /feed/posts
router.post(
  '/posts',
  [
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5 }),
  ],
  feedController.postPosts
);

router.get('/post/:id', feedController.getPost)

module.exports = router;
