const errorHandler = (err, req, res, next) => {
  const message = err.message;
  const statusCode = err.statusCode;
  return res.status(statusCode).json({ message, statusCode });
};

module.exports = errorHandler;
