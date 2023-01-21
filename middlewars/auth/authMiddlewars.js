const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken"); //*%$ -----------Token---------- *%$//
const User = require("../../model/user/User");

const authMiddleware = expressAsyncHandler(async (req, res, next) => {
  let token;

  if (req?.headers?.authorization?.startsWith("bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_key); //*%$ -----------Token---------- *%$//
        const user = await User.findById(decoded?.id).select("-password"); //*%$ -----------Token---------- *%$//
        req.user = user;
        next();
      }
    } catch (err) {
      throw new Error("NOt authorized token expired , login again ");
    }
  } else {
    throw new Error("there is no token attach to header");
  }
});

module.exports = authMiddleware;
