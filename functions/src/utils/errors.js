class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

const handleApiError = (res, error, defaultMessage = 'An unexpected error occurred.') => {
  console.error('API Error Details:', {
    message: error.message,
    code: error.code,
    stack: error.stack
  });

  const statusCode = error.statusCode || 500;
  const message = error.statusCode ? error.message : defaultMessage;

  return res.status(statusCode).json({
    success: false,
    error: message,
    code: error.code || 'UNKNOWN_ERROR'
  });
};

module.exports = {
  AppError,
  handleApiError
};
