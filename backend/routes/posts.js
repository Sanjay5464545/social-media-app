const express = require('express');
const Post = require('../models/Post');
const User = require('../models/User');

const router = express.Router();


// Middleware to verify JWT token
// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  // Clean the token (remove any extra spaces)
  const cleanToken = token.trim();
  console.log("Token received:", cleanToken);
  
  const jwt = require('jsonwebtoken');
  jwt.verify(cleanToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("Token verification failed:", err);
      return res.status(403).json({ message: 'Invalid token' });
    }
    console.log("Token verified successfully, decoded token:", decoded);
    req.user = { userId: decoded.userId };
    console.log("req.user set to:", req.user);
    next();
  });
};
// Create Post
// Create Post
router.post('/', authenticateToken, async (req, res) => {
  try {
    console.log("=== Creating a new post ===");
    console.log("User ID from token:", req.user.userId);
    console.log("Request body:", req.body);
    
    const { content, imageUrl } = req.body;
    
    // Validate that at least content or imageUrl is provided
    if (!content && !imageUrl) {
      console.log("Validation failed: no content or image");
      return res.status(400).json({ message: 'Post must have content or an image' });
    }
    
    console.log("Validation passed, creating post object...");
    const newPost = new Post({
      userId: req.user.userId,
      content,
      imageUrl
    });
    
    console.log("Post object created:", newPost);
    
    console.log("Saving post to database...");
    const savedPost = await newPost.save();
    console.log("Post saved successfully:", savedPost);
    
    res.status(201).json(savedPost);
  } catch (error) {
    console.log("Error creating post:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
// Get All Posts
router.get('/', async (req, res) => {
  try {
    console.log("=== Fetching all posts ===");
    
    // First, try to get posts without populate
    const postsWithoutPopulate = await Post.find();
    console.log("Posts without populate:", postsWithoutPopulate);
    
    // Then try with populate
    const posts = await Post.find()
      .populate('userId', 'username')
      .populate('likes', 'username')
      .populate('comments.userId', 'username')
      .sort({ createdAt: -1 });
    
    console.log("Posts with populate:", posts);
    res.json(posts);
  } catch (error) {
    console.log("Error fetching posts:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
// Like Post
router.post('/:id/like', authenticateToken, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.userId;
    
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Check if user already liked the post
    const alreadyLiked = post.likes.includes(userId);
    
    if (alreadyLiked) {
      // Remove like
      post.likes = post.likes.filter(id => id.toString() !== userId);
    } else {
      // Add like
      post.likes.push(userId);
    }
    
    await post.save();
    
    // Populate user info
    await post.populate('userId', 'username');
    await post.populate('likes', 'username');
    await post.populate('comments.userId', 'username');
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Comment on Post
router.post('/:id/comment', authenticateToken, async (req, res) => {
  try {
    const postId = req.params.id;
    const { text } = req.body;
    const userId = req.user.userId;
    
    if (!text) {
      return res.status(400).json({ message: 'Comment text is required' });
    }
    
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Add comment
    post.comments.push({
      userId,
      text,
      createdAt: new Date()
    });
    
    await post.save();
    
    // Populate user info
    await post.populate('userId', 'username');
    await post.populate('likes', 'username');
    await post.populate('comments.userId', 'username');
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;