export const globalErrorHandler = (err, req, res, next) => {
  const status = err.cause || 500;
  return res.status(status).json({
    message: status === 500 ? "Internal Server Error" : err.message,
    error: err.message,
    stack: err.stack,
  });
};
