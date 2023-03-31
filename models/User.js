const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true],
  },

  email: {
    type: String,
    required: [true, "Please provide email"],
    unique: true,
    match: /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
  },

  password: {
    type: String,
    required: [true],
  },
});

UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(this.password, salt);
  this.password = hashedPass;
});

UserSchema.methods.matchPassword = async function (userPassword) {
  const isPasswordMatch = await bcrypt.compare(userPassword, this.password);
  return isPasswordMatch;
};

UserSchema.methods.createJWT = function () {
  return jwt.sign({ username: this.username, userId: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
