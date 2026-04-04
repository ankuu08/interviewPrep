const asyncHandler = require('express-async-handler');
const chat = require('../models/Chatmodel');
const User = require('../models/Usermodel');

const acessChats = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    console.log("UserId params is not found");
    return res.status(400);
  }
  var isChat = await chat.find({
    isGroupChat: false,
    $and: [
      { users: { $all: [req.user._id, userId] } },
      // { users: { $eleMatch: { $eq: userId } } }
    ]
  }).populate('users', "-password")
    .populate("latestMessage")

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name email pic"
  })
  if (isChat.length > 0) {
    res.status(200).send(isChat[0]);
  } else {
    try {
      const chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId]
      }

      const createChat = await chat.create(chatData);
      const fullchat = await createChat.populate('users', "-password")
      res.status(200).send(fullchat);
    } catch (err) {
      res.status(400)
      res.send(err.message);
    }
  }

})

const fetchChats = asyncHandler(async (req, res) => {
  try {
    const allChats = await chat.find({
      users: { $elemMatch: { $eq: req.user._id } }
    })
      .populate('users', '-password')
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
    const populatedChats = await User.populate(allChats, {
      path: "latestMessage.sender",
      select: "name email pic"
    })
    res.status(200).send(populatedChats);
  } catch (error) {
    res.status(400);
    throw new Error("Error occured while fethcing chats!");
  }
})

const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.name || !req.body.users) {
    return res.status(400).send({ message: "Please fill all the fields" });
  }

  var users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res.status(400).send({ message: "Group Chat must have more than 2 members" });
  }

  users.push(req.user._id);
  try {
    const newGroupChat = await chat.create({
      chatName: req.body.name,
      isGroupChat: true,
      users: users,
      groupAdmin: req.user._id
    })
    const populatedGroupChat = await chat.findOne({ _id: { $eq: newGroupChat._id } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
    res.status(200).json(populatedGroupChat);
  } catch (error) {
    res.status(400).send(error.message);
  }

})

const renameChat = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;
  const updatedChat = await chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName
    },
    {
      new: true,
    }
  ).populate("users", "-password")
    .populate("groupAdmin", "-password")
  if (!updatedChat) {
    res.status(404)
    throw new Error("Chat not Found");
  }
  res.status(200).json(updatedChat);
})

const addUser = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  const addedUser = await chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId }
    }, {
    new: true
  }
  ).populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!addedUser) {
    res.status(404);
    throw new Error("Chat not Found!");
  }
  res.status(200).json(addedUser);
})

const removeUser = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const removeUser = await chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  ).populate("users", "-password")
    .populate("groupAdmin", "-password")

  if (!removeUser) {
    res.status(404);
    throw new Error("Chat not found");
  }
  res.status(200).json(removeUser);
})

module.exports = { acessChats, fetchChats, createGroupChat, renameChat, addUser, removeUser };