/**
 * 404 Not Found handler
 */
const notFoundHandler = (req, res, next) => {
  res.status(404).render('pages/404', {
    title: 'Page Not Found — VibeTune'
  });
};

/**
 * Global error handler
 * Catches all errors passed via next(error)
 */
const globalErrorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.stack || err.message);

  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production'
    ? 'Something went wrong'
    : err.message;

  res.status(statusCode).render('pages/error', {
    title: 'Error — VibeTune',
    message,
    statusCode
  });
};

/**
 * Async handler wrapper — catches async errors and passes to next()
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  notFoundHandler,
  globalErrorHandler,
  asyncHandler
};
