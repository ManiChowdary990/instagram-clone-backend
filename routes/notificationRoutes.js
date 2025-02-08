const express = require('express');
const Notification = require('../models/Notification');
const { protect } = require('../middleware/authMiddleware');
const { createNotification, getNotifications, markAsRead } = require('../controllers/notificationController');

const router = express.Router();


router.post('/', protect, createNotification);
router.get('/', protect, getNotifications);
router.put('/:id/read', protect, markAsRead);


// Get Notifications
router.get('/', protect, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id });
    res.json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create Notification (e.g., when a user likes a post, etc.)
router.post('/', protect, async (req, res) => {
  const { message } = req.body;

  try {
    const notification = new Notification({
      user: req.user.id,
      message,
    });

    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
