const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Signup function
exports.signup = async (req, res) => {
  const { email, fullName, username, password } = req.body;

  if (!email || !fullName || !username || !password) {
    return res.status(400).json({ message: "Please fill out all fields." });
  }

  try {
    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already taken." });
    }


    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, username, fullName, password: hashedPassword });
    await newUser.save();



    const user = new User({ email, fullName, username, password });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Something went wrong. Please try again later." });
  }
};

// Login function
exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Please fill out all fields." });
  }

  try {
    const user = await User.findOne({ username });
    if (!user || !user.isPasswordValid(password)) {
      return res.status(400).json({ message: "Invalid username or password." });
    }




    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid username or password" });
    }


    

    // Generate JWT token (if using JWT)
    const token = user.generateAuthToken();

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Something went wrong. Please try again later." });
  }
};
