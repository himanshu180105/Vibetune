const User = require('../models/User');

/**
 * Set current user on res.locals for all views
 * Runs on every request — makes `currentUser` available in EJS templates
 */
const setCurrentUser = async (req, res, next) => {
  try {
    if (req.session && req.session.userId) {
      const user = await User.findById(req.session.userId).select('-password');
      res.locals.currentUser = user;
    } else {
      res.locals.currentUser = null;
    }
    next();
  } catch (error) {
    res.locals.currentUser = null;
    next();
  }
};

/**
 * Require authentication — redirects to login if not authenticated
 */
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }

  req.flash('error', 'Please log in to continue');
  return res.redirect('/auth/login');
};

/**
 * Require admin role — returns 403 if not admin
 */
const isAdmin = (req, res, next) => {
  if (res.locals.currentUser && res.locals.currentUser.role === 'admin') {
    return next();
  }

  req.flash('error', 'Access denied. Admin privileges required.');
  return res.redirect('/');
};

module.exports = {
  setCurrentUser,
  isAuthenticated,
  isAdmin
};
