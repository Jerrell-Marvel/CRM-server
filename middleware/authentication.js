const UnauthorizedError = require("../errors/UnathorizedError");
const jwt = require("jsonwebtoken");

const authentication = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    throw new UnauthorizedError("Token not provided");
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { username: payload.username, userId: payload.userId };
    next();
  } catch (err) {
    throw new UnauthorizedError("Invalid token");
  }
};

module.exports = authentication;
