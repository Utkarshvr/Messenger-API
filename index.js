require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoute = require("./routes/userRoute");
const messageRoute = require("./routes/messageRoute");

const app = express();

const socket = require("socket.io");

app.get("/", (req, res) => {
  res.json({ msg: "Messenger API" });
});

app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoute);
app.use("/api/messages", messageRoute);

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connection Successfull");
  })
  .catch(() => {
    console.log("DB Connection Unsuccessfull");
  });

const server = app.listen(process.env.PORT, () => {
  console.log(`Server Started on Port ${process.env.PORT}`);
}); // returns an Http Server

const io = socket(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
    socket.emit("update-contact", userId);
  });
  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) socket.to(sendUserSocket).emit("msg-recieve", data.msg);
  });
});
