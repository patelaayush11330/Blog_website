const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const { 
  getAllUsers, 
  deleteUser, 
  getStats, 
  getGrowth, 
  getTopAuthors,
  updateUserRole,
  banUser,
  unbanUser,
  getRecentActivity
} = require('../controllers/userController');
const { 
  adminGetAllPosts, 
  deletePost, 
  setFeatured,
  getPostAnalytics,
  bulkDeletePosts
} = require('../controllers/postController');
const { 
  getAllComments, 
  deleteComment,
  getCommentAnalytics 
} = require('../controllers/commentController');

const router = express.Router();

// All routes require admin access
router.use(protect, admin);

// User Management
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.patch('/users/:id/role', updateUserRole);
router.patch('/users/:id/ban', banUser);
router.patch('/users/:id/unban', unbanUser);

// Post Management
router.get('/posts', adminGetAllPosts);
router.delete('/posts/:id', deletePost);
router.patch('/posts/:id/featured', setFeatured);
router.delete('/posts/bulk', bulkDeletePosts);
router.get('/posts/analytics', getPostAnalytics);

// Comment Management
router.get('/comments', getAllComments);
router.delete('/comments/:id', deleteComment);
router.get('/comments/analytics', getCommentAnalytics);

// Analytics & Reports
router.get('/analytics/stats', getStats);
router.get('/analytics/growth', getGrowth);
router.get('/analytics/activity', getRecentActivity);
router.get('/analytics/top-authors', getTopAuthors);

module.exports = router; 