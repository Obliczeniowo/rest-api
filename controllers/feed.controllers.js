const { validationResult } = require('express-validator');

const Post = require('../models/post.js');

const errorCb = (err, next) => {
  if (!err.statusCode) {
    err.statusCode = 500;
  }
  return next(err);
};

exports.getPosts = (req, res, next) => {
  Post.find().then((posts) => {
    res.status(200).json({
      posts,
    });
  }).catch((err) => {
      errorCb(err, next);
  });
};

exports.postPosts = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Something wents wrong');
    error.status = 422;
    throw error;
  }

  const post = new Post({
    ...req.body,
    imageUrl: 'images/winchester.jpg',
    creator: { name: 'Grzegorz Brzęczyszczykiewicz' },
  });
  post
    .save()
    .then((post) => {
      res.status(201).json({
        message: 'Post created successfully!',
        post,
      });
    })
    .catch((err) => {
      errorCb(err, next);
    });
};

exports.getPost = (req, res, next) => {
  const id = req.params.id;

  Post.findById(id)
    .then((post) => {
      if (!post) {
        const error = new Error('Could not find post');
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ post });
    })
    .catch((err) => {
      errorCb(err, next);
    });
};
