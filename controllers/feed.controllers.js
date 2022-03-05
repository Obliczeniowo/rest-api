const fs = require('fs');
const path = require('path');

const { validationResult } = require('express-validator');

const { errorCb, getError } = require('../utils/errors.js');

const Post = require('../models/post.model.js');
const User = require('../models/user.model.js');

exports.getPosts = (req, res, next) => {
  const page = req.query.page;
  const perPage = 2;
  let totalIatems;

  Post.find()
    .countDocuments()
    .then((count) => {
      totalIatems = count;
      return Post.find()
        .populate('creator')
        .sort({ createdAt: -1 })
        .skip((page - 1) * perPage)
        .limit(perPage);
    })
    .then((posts) => {
      res.status(200).json({
        posts,
        totalItems: totalIatems,
      });
    })
    .catch((err) => {
      errorCb(err, next);
    });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw getError('Something went wrong!', 422);
  }

  if (!req.file) {
    throw getError('No file att all!', 422);
  }

  let creator;
  const post = new Post({
    ...req.body,
    imageUrl: req.file.path.split('\\').join('/'),
    creator: req.userId,
  });

  post
    .save()
    .then((post) => {
      return User.findById(req.userId);
    })
    .then((user) => {
      if (!user) {
        throw new Error('No user');
      }
      creator = user;
      user.posts.push(post);
      return user.save();
    })
    .then((user) => {
      res.status(201).json({
        message: 'Post created successfully!',
        post,
        creator: {
          _id: creator._id,
          name: creator.name,
        },
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
        throw getError('Could not find post', 404);
      }
      res.status(200).json({ post });
    })
    .catch((err) => {
      errorCb(err, next);
    });
};

exports.updatePost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw getError('Something went wrong!', 422);
  }

  const body = req.body;

  req.body.imageUrl = req.body.image;

  delete req.body.image;
  if (req.file) {
    req.body.imageUrl = req.file.path.split('\\').join('/');
  }

  if (!req.body.imageUrl) {
    throw getError('Where is my image url things?', 422);
  }

  Post.findById(req.params.id)
    .then((post) => {
      if (!post) {
        throw getError('Could not find', 404);
      }
      if (req.body.imageUrl !== post.imageUrl) {
        clearImage(post.imageUrl);
      }

      if (post.creator._id.toString() !== req.userId) {
        throw getError('Not authorized', 403);
      }

      Object.keys(req.body).forEach((key) => (post[key] = req.body[key]));

      return post.save();
    })
    .then((post) => {
      return res.status(200).json({ post });
    })
    .catch((err) => {
      errorCb(err, next);
    });
};

exports.deletePost = (req, res, next) => {
  const id = req.params.id;

  Post.findById(id)
    .then((post) => {
      if (!post) {
        throw getError('Could not find', 404);
      }
      if (post.creator.toString() !== req.userId) {
        throw getError('Not authorized', 403);
      }
      try {
        clearImage(post.imageUrl);
      } catch (err) {}
      return Post.findByIdAndDelete(id);
    })
    .then((result) => {
      return User.findById(req.userId);
    })
    .then((user) => {
      user.posts.pull(id);
      return user.save();
    })
    .then((result) => {
      res.status(200).json({ message: 'Post deleted' });
    })
    .catch((err) => {
      errorCb(err, next);
    });
};

const clearImage = (filePath) => {
  filePath = path.join(__dirname, '..', filePath);

  fs.unlink(filePath, (err) => console.log(err));
};
