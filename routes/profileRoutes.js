const express = require('express');
const Profile = require('../models/Profile');
const User = require('../models/User');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware'); // Assuming you will add authentication middleware

// Get User Profile
router.get('/:userId', async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.userId }).populate('user', 'username email');
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create or Update User Profile
router.post('/', protect, async (req, res) => {
  const { bio, profilePicture } = req.body;

  // Check if the user already has a profile
  let profile = await Profile.findOne({ user: req.user.id });

  if (profile) {
    // Update the profile if it exists
    profile.bio = bio || profile.bio;
    profile.profilePicture = profilePicture || profile.profilePicture;

    await profile.save();
    return res.json(profile);
  }

  // Create a new profile if it doesn't exist
  profile = new Profile({
    user: req.user.id,
    bio,
    profilePicture,
  });

  await profile.save();
  res.status(201).json(profile);
});

module.exports = router;
