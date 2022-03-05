const { validationResult } = require('express-validator');

const Post = require('../models/post.js');

exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        _id: '12321',
        title: 'title',
        content: 'First post ever!',
        imageUrl: 'images/winchester.jpg',
        creator: {
          name: 'some name',
        },
        createdAt: new Date(),
      },
    ],
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
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
