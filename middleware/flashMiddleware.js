/**
 * Flash messages middleware
 * Makes flash messages available in all EJS views via res.locals
 */
const setFlashMessages = (req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
};

module.exports = { setFlashMessages };
