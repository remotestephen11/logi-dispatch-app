function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const code = err.code || 'INTERNAL_ERROR';
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    ok: false,
    error: {
      code,
      message,
    },
  });
}

module.exports = errorHandler;
