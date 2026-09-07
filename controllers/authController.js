const { asyncHandler } = require('../middleware/errorMiddleware');
const authService = require('../services/authService');

/**
 * GET /auth/login — Render login page
 */
const getLogin = (req, res) => {
  if (req.session.userId) return res.redirect('/');
  res.render('auth/login', { title: 'Login — VibeTune' });
};

/**
 * POST /auth/login — Authenticate user
 */
const postLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    req.flash('error', 'Please provide email and password');
    return res.redirect('/auth/login');
  }

  try {
    const user = await authService.loginUser({ email, password });
    req.session.userId = user._id;
    req.flash('success', `Welcome back, ${user.name}!`);
    res.redirect('/');
  } catch (error) {
    req.flash('error', error.message);
    res.redirect('/auth/login');
  }
});

/**
 * GET /auth/register — Render register page
 */
const getRegister = (req, res) => {
  if (req.session.userId) return res.redirect('/');
  res.render('auth/register', { title: 'Register — VibeTune' });
};

/**
 * POST /auth/register — Create new user account
 */
const postRegister = asyncHandler(async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  // Validation
  if (!name || !email || !password) {
    req.flash('error', 'All fields are required');
    return res.redirect('/auth/register');
  }

  if (password.length < 6) {
    req.flash('error', 'Password must be at least 6 characters');
    return res.redirect('/auth/register');
  }

  if (password !== confirmPassword) {
    req.flash('error', 'Passwords do not match');
    return res.redirect('/auth/register');
  }

  try {
    const user = await authService.registerUser({ name, email, password });
    req.session.userId = user._id;
    req.flash('success', `Welcome to VibeTune, ${user.name}!`);
    res.redirect('/');
  } catch (error) {
    req.flash('error', error.message);
    res.redirect('/auth/register');
  }
});

/**
 * GET /auth/logout — Destroy session and redirect
 */
const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) console.error('Session destroy error:', err);
    res.redirect('/auth/login');
  });
};

module.exports = {
  getLogin,
  postLogin,
  getRegister,
  postRegister,
  logout
};
