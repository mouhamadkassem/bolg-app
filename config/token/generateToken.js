const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_key, { expiresIn: "20d" });
};

module.exports = generateToken;
