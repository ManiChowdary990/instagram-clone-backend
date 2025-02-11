const Post = require('../models/Post');
const User = require('../models/User');
const Notification = require('../models/Notification'); // Import notification model

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const { text, image } = req.body;
    const newPost = new Post({ user: req.user.id, text, image });

    await newPost.save();
    res.status(201).json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Get all posts
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("user", "username").sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
// Like a post
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.likes.includes(req.user.id)) {
      post.likes = post.likes.filter((id) => id !== req.user.id); // Unlike
    } else {
      post.likes.push(req.user.id); // Like
    }

    await post.save();
    res.status(200).json({ message: "Like updated", post });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Add comment
exports.addComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({ user: req.user.id, text: req.body.text });
    await post.save();

    res.status(201).json({ message: "Comment added", post });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Get comments
exports.getComments = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("comments.user", "username");
    if (!post) return res.status(404).json({ message: "Post not found" });

    res.status(200).json(post.comments);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Add a comment to a post
exports.addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const { text } = req.body;
    const userId = req.userId;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Add comment to the post
    post.comments.push({ user: userId, text });
    await post.save();

    res.status(201).json({ message: 'Comment added successfully', post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

