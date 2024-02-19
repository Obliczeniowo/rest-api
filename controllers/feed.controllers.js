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
    return res
      .status(422)
      .json({ message: 'Validation failure', errors: errors.errors });
  }

  const post = new Post({
    ...req.body,
    imageUrl: 'images/winchester.jpg',
    creator: { name: 'Grzegorz Brzęczyszczykiewicz' },
  });
  post.save().then((post) => {
    res.status(201).json({
      message: 'Post created successfully!',
      post,
    });
  });
};
