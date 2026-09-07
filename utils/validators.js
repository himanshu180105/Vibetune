/**
 * VibeTune — Input Validators
 */

/**
 * Validate email format
 * @param {string} email
 * @returns {boolean}
 */
const isValidEmail = (email) => {
  const emailRegex = /^\S+@\S+\.\S+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password
 * @returns {{valid: boolean, message: string}}
 */
const validatePassword = (password) => {
  if (!password) return { valid: false, message: 'Password is required' };
  if (password.length < 6) return { valid: false, message: 'Password must be at least 6 characters' };
  return { valid: true, message: '' };
};

/**
 * Sanitize a string — trim and remove HTML tags
 * @param {string} str
 * @returns {string}
 */
const sanitize = (str) => {
  if (!str) return '';
  return str.toString().trim().replace(/<[^>]*>/g, '');
};

/**
 * Validate MongoDB ObjectId format
 * @param {string} id
 * @returns {boolean}
 */
const isValidObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

module.exports = {
  isValidEmail,
  validatePassword,
  sanitize,
  isValidObjectId
};
