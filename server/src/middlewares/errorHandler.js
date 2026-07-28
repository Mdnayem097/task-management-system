const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Handling Mongoose Duplicate Key Error (e.g., duplicate email)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    err.statusCode = 400;
    err.message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`;
  }

  // Handling Mongoose Validation Errors
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((el) => el.message);
    err.statusCode = 400;
    err.message = `Invalid input data: ${errors.join('. ')}`;
  }

  // Handling JWT Errors
  if (err.name === 'JsonWebTokenError') {
    err.statusCode = 401;
    err.message = 'Invalid token. Please log in again.';
  }

  if (err.name === 'TokenExpiredError') {
    err.statusCode = 401;
    err.message = 'Token has expired. Please log in again.';
  }

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;