const { validationResult } = require('express-validator');

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
    return res.status(422).json({ message: 'Validation failure', errors: errors.errors });
  }
  res.status(201).json({
    message: 'Post created successfully!',
    post: {
      _id: new Date().toISOString(),
      ...req.body,
      creator: { name: 'Grzegorz Brzęczyszczykiewicz' },
      createdAt: new Date(),
    },
  });
};
