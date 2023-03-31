const errorHandler = (err, req, res, next) => {
  const message = err.message;
  const statusCode = err.statusCode;
  return res.json({ message, statusCode });
};

module.exports = errorHandler;
