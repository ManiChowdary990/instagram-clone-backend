const Message = require('../models/message');
const User = require('../models/User');


// Send message
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, messageText } = req.body;
    const senderId = req.user.id;

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    const message = new Message({ sender: senderId, receiver: receiverId, messageText });
    await message.save();

    res.status(201).json({ message: "Message sent successfully", message });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Get all messages between the logged-in user and a target user
// Get messages
exports.getMessages = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const userId = req.user.id;

    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: targetUserId },
        { sender: targetUserId, receiver: userId },
      ],
    })
      .populate("sender", "username")
      .populate("receiver", "username")
      .sort("createdAt");

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};


// Mark message as read
exports.markAsRead = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (message.receiver.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    message.read = true;
    await message.save();

    res.json({ message: "Message marked as read", message });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};