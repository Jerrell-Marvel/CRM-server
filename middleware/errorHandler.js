const { StatusCodes } = require("http-status-codes");

const errorHandler = (err, req, res, next) => {
  const message = err.message;
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  return res.status(statusCode).json({ message, statusCode });
};

module.exports = errorHandler;
