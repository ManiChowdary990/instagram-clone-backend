const Notification = require('../models/Notification');
const User = require('../models/User');

// Create a new notification
exports.createNotification = async (req, res) => {
  try {
    const { message } = req.body;
    const notification = new Notification({ user: req.user.id, message });

    await notification.save();
    res.status(201).json({ message: "Notification created successfully", notification });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Get notifications for a user
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id }).sort("-createdAt");
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Mark a notification as read
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    notification.isRead = true;
    await notification.save();

    res.json({ message: "Notification marked as read", notification });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.createNotification = async (req, res) => {
  try {
    const { userId, message, link } = req.body;

    // Create the notification in the database
    const notification = new Notification({
      user: userId,
      message,
      link,
    });

    await notification.save();

    // Emit notification to the connected clients (via Socket.IO)
    io.emit("receive-notification", {
      message: notification.message,
      link: notification.link,
      createdAt: notification.createdAt,
    });

    res.status(201).json({ message: 'Notification created successfully', notification });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

