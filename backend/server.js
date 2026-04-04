const express = require("express");
const { chats } = require("./data/data");

const app = express();
const dotenv = require("dotenv");
const connectDb = require("./config/db");
const cors = require("cors");
dotenv.config();
connectDb();
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  credentials: true
}))
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { notfound, errorHandler } = require("./middleware/errormiddleware");
app.use(express.json());
// app.get("/", (req, res) => {
//   res.send("API is running");
// })

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/messages', messageRoutes)
// app.use(notfound);
// app.use(errorHandler);

const PORT = process.env.PORT || 5000
const server = app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`)
});

const path = require("path");

// Serve frontend build
app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get((req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
});

const io = require('socket.io')(server, {
  pingTimeout: 60000,
  transports: ["websocket", "polling"],
  cors: {
    origin: process.env.FRONTEND_URL || "*",
  }
})
app.use(notfound);
app.use(errorHandler);
const roomUsers = {};
const roomCode = {};
io.on("connection", (socket) => {
  console.log("Socket is connected!", socket.id);

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  })

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("user joined room:", room);
  })

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newRevievedMessage) => {
    var chat = newRevievedMessage.chat;
    if (!chat.users) {
      return console.log("Chat doesn't have users!");
    }
    chat.users.forEach(user => {
      if (user._id === newRevievedMessage.sender._id) {
        return;
      }
      socket.in(user._id).emit("message received", newRevievedMessage);
      console.log("Sending message to:", user._id);
    });
  })
  socket.on("join-room", ({ roomId, name }) => {
    socket.join(roomId);

    if (!roomUsers[roomId]) {
      roomUsers[roomId] = [];
    }
    roomUsers[roomId] = roomUsers[roomId].filter((u) => u.name !== name);
    roomUsers[roomId].push({
      socketId: socket.id,
      name: name
    })

    socket.emit("code-update", roomCode[roomId] || "");

    io.to(roomId).emit("user-update", roomUsers[roomId]);

  })

  socket.on("code-change", ({ roomId, code }) => {
    roomCode[roomId] = code;
    socket.to(roomId).emit("code-update", code)
  })
  socket.on("lang-change", ({ roomId, lang }) => {
    socket.to(roomId).emit("lang-change", lang);
  })
  socket.on("disconnect", () => {
    for (const roomId in roomUsers) {
      roomUsers[roomId] = roomUsers[roomId].filter((u) => u.socketId !== socket.id);
      io.to(roomId).emit("user-update", roomUsers[roomId]);
    }
  })
  // socket.off("setup", () => {
  //   console.log("User Disconnected!");
  //   socket.leave(userData._id);
  // })
})
