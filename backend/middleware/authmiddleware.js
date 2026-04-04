const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/Usermodel");

const protect = asyncHandler(async (req, res, next) => {
  // console.log(req.headers.authorization);
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Invalid Authorization");
    }
  } else {
    res.status(401);
    throw new Error("No Authorization token");
  }
});

module.exports = { protect };