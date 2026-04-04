const asyncHandler = require("express-async-handler");
const User = require("../models/Usermodel");
const generateToken = require("../config/generateToken");
// const { options } = require("../routes/userRoutes");

const userRegister = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400)
    throw new Error("Invalid")
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400)
    throw new Error("User Exists")
  }
  const user = await User.create({
    name, email, password, pic
  })
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      password: user.password,
      pic: user.pic,
      token: generateToken(user._id)
    })
  } else {
    res.status(400)
    throw new Error("Error creating the user");
  }
});

// const authUser = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;
//   const user = await User.findOne({ email });

//   if (user && (await user.matchPassword(password))) {
//     res.status(200).json({
//       name: user.name,
//       email: user.email,
//       password: user.password,
//       pic: user.pic,
//       token: generateToken(user._id),
//     });
//   } else {
//     res.status(400);
//     throw new Error("User not found");
//   }
// })
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(400);
    throw new Error("Invalid email or password");
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    res.status(400);
    throw new Error("Invalid email or password");
  }

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    pic: user.pic,
    token: generateToken(user._id),
  });
});
const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search ? {
    $or: [
      { name: { $regex: req.query.search, $options: "i" } },
      { email: { $regex: req.query.search, $options: "i" } }
    ]
  } : {};

  const user = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(user);
})
module.exports = { userRegister, authUser, allUsers };