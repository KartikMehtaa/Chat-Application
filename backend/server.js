const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const Message = require("./models/message");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/chatapp")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Get old messages
app.get("/messages", async (req, res) => {
  const messages = await Message.find().sort({ createdAt: 1 });
  res.json(messages);
});

// Socket connection
io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("sendMessage", async (data) => {
    const newMsg = new Message(data);
    await newMsg.save();
    io.emit("receiveMessage", newMsg);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
