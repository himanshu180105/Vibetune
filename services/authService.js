const User = require('../models/User');

/**
 * Register a new user
 */
const registerUser = async ({ name, email, password }) => {
  // Check if email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('An account with this email already exists');
  }

  const user = await User.create({ name, email, password });
  return user;
};

/**
 * Authenticate user with email and password
 */
const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  return user;
};

/**
 * Get user by ID
 */
const getUserById = async (userId) => {
  return User.findById(userId).select('-password');
};

module.exports = {
  registerUser,
  loginUser,
  getUserById
};
