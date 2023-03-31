const UnauthorizedError = require("../errors/UnathorizedError");
const jwt = require("jsonwebtoken");

const authentication = (req, res) => {
  const { token } = req.cookies;

  if (!token) {
    throw new UnauthorizedError("Token not provided");
  }

  try {
    const { username, userId } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { username, userId };
    next();
  } catch (err) {
    throw new UnauthorizedError("Invalid token");
  }
};

module.exports = authentication;
