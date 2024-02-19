const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const User = require('../models/user.model');
const Post = require('../models/post.model');

module.exports = {
  createUser: async function ({ userInput }, req) {
    const errors = [];
    if (!validator.isEmail(userInput.email)) {
      errors.push({ message: 'Email not valid!' });
    }
    console.log(validator.isLength(userInput.password, { min: 5 }));
    if (
      validator.isEmpty(userInput.password) /* ||
      validator.isLength(userInput.password, { min: 5 }) */
    ) {
      errors.push({ message: 'Wrong password!' });
    }

    if (errors.length > 0) {
      const error = new Error('Invalid length');
      error.data = errors;
      error.code = 422;
      throw error;
    }

    const existingUser = await User.findOne({ email: userInput.email });
    if (existingUser) {
      const error = new Error('User exist!');
      throw error;
    }
    const hashedPw = await bcrypt.hash(userInput.password, 12);

    const user = new User({
      password: hashedPw,
      email: userInput.email,
      name: userInput.name,
    });
    const createdUser = await user.save();
    return { ...createdUser._doc, _id: createdUser._id.toString() };
  },
  login: async function ({ email, password }) {
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error('User not found');
      error.code = 401;
      throw error;
    }

    const isEquale = await bcrypt.compare(password, user.password);

    if (!isEquale) {
      const error = new Error('Password is incorrect');

      error.code = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
      },
      'sicret',
      { expiresIn: '1h' }
    );

    return { token, userId: user._id.toString() };
  },
  createPost: async ({ postInput }, req) => {
    if (!req.isAuth) {
      const error = new Error('Not authenticated');
      error.code = 401;
      throw error;
    }
    const errors = [];
    if (validator.isEmpty(postInput.title)) {
      errors.push('Title invalid');
    }

    if (errors.length) {
      const err = new Error('invalid post');
      error.data = errors;
      error.code = 422;
      throw error;
    }

    const user = await User.findById(req.userId);

    if (!user) {
      const err = new Error('invalid user');
      error.data = errors;
      error.code = 401;
      throw error;
    }

    const post = new Post({ ...postInput, creator: user });

    const createdPost = await post.save();

    user.posts.push(createdPost);

    await user.save();

    return {
      ...createdPost,
      _id: createdPost._id.toString(),
      createdAt: createdPost.createdAt.toISOString(),
      createdAt: createdPost.updatedAt.toISOString(),
    };
  },
  posts: async (args, req) => {
    if (!req.isAuth) {
      const error = new Error('Not authenticated');
      error.code = 401;
      throw error;
    }

    const totalPosts = await Post.find().countDocuments();
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('creator');

    return { posts: posts.map(item => ({
      ...item._doc,
      _id: itam._id.toString(),
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.createdAt.toISOString()
    })), totalPosts };
  },
};
