const asyncHandler = require('express-async-handler');
const Message = require('../models/Messagemodel');
const chat = require('../models/Chatmodel');
const User = require('../models/Usermodel');
const Groq = require('groq-sdk');
const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    res.status(400).send("Invalid");
    return;
  }
  var message = {
    sender: req.user._id,
    content: content,
    chat: chatId
  }
  try {
    const newMessage = await Message.create(message);
    let curMessage = await Message.findById(newMessage._id)
      .populate('sender', "-password")
      .populate('chat')
    curMessage = await User.populate(curMessage, {
      path: "chat.users",
      select: "name email pic"
    })
    const updateChat = await chat.findByIdAndUpdate(req.body.chatId, { latestMessage: curMessage })
    res.json(curMessage);
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
    return;
  }
})
const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "-password")
      .populate("chat");
    res.json(messages);
  } catch (err) {
    console.log(err);
    res.status(400).send("Messages Not found!");
  }
})

const aiMessages = asyncHandler(async (req, res) => {
  const { content } = req.body;
  if (!content) {
    res.status(400).send("Invalid Content!");
  }
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  try {
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: content,
        },
      ],
      model: "openai/gpt-oss-20b",
    });
    res.send(response);
  } catch (err) {
    console.log(err);
    res.status(400).send("Error Occured!");
  }
})

module.exports = { sendMessage, allMessages, aiMessages };