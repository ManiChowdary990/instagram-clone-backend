const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const verifyToken = require('../middleware/verifyToken');

// Get user profile (protected route)
router.get('/profile', verifyToken, UserController.getUserProfile);

// Update user profile (protected route)
router.put('/profile', verifyToken, UserController.updateUserProfile);

module.exports = router;
