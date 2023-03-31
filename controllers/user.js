const BadRequestError = require("../errors/BadRequestError");
const UnauthorizedError = require("../errors/UnathorizedError");
const User = require("../models/User");

const register = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username) {
    throw new BadRequestError("Username can't be empty");
  }

  if (!email) {
    throw new BadRequestError("Email cannot be empty");
  }

  if (!password) {
    throw new BadRequestError("Password can't be empty");
  }

  const user = await User.create({ username, email, password });
  return res.json({ user });
};

const login = async (req, res) => {
  const { username, email, password } = req.body;

  if (!email) {
    throw new BadRequestError("Email cannot be empty");
  }

  if (!password) {
    throw new BadRequestError("Password can't be empty");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthorizedError("Email is not registered");
  }

  //Checking the password
  const isPasswordMatch = await user.matchPassword(password);
  if (!isPasswordMatch) {
    throw new UnauthorizedError("Incorrect password");
  }

  const token = await user.createJWT();

  return res.json({ token });
};

module.exports = { login, register };
