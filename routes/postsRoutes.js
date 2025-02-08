const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { createPost, getPosts, likePost, addComment, getComments } = require("../controllers/postController");
const multer = require("multer");
const Post = require("../models/Post");

const router = express.Router();

// Configure Multer for Image Uploads
const upload = multer({ dest: "uploads/" });

// ✅ Create a Post
router.post("/", protect, createPost);

// ✅ Get All Posts
router.get("/", getPosts);

// ✅ Like a Post
router.put("/:id/like", protect, likePost);

// ✅ Add a Comment
router.post("/:id/comment", protect, addComment);

// ✅ Get Comments for a Post
router.get("/:id/comments", getComments);

// ✅ Create Post with Image Upload
router.post("/create_post", protect, upload.single("image"), async (req, res) => {
  try {
    const post = new Post({
      image: req.file.path,
      caption: req.body.caption,
      user: req.user.id,
    });

    await post.save();
    res.status(201).json({ message: "Post created successfully", post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Delete a Post
router.delete("/:postId", protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not authorized" });
    }

    await post.remove();
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
