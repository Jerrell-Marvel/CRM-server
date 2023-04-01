const { StatusCodes } = require("http-status-codes");
class UnprocessableEntityError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNPROCESSABLE_ENTITY;
  }
}

module.exports = UnprocessableEntityError;
