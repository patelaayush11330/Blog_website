const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const { getUserProfile, getCurrentUserProfile, updateProfile, getAllUsers, deleteUser, toggleBookmark, getBookmarks, getStats, getGrowth, getTopAuthors, followUser, getFollowers, getFollowing, getFollowingFeed, getRecentActivity, searchUsers, getUserProfilePublic, getUserEngagements } = require('../controllers/userController');

const router = express.Router();

router.get('/profile/me', protect, getCurrentUserProfile);
router.put('/profile', protect, updateProfile);
router.get('/admin/users', protect, admin, getAllUsers);
router.delete('/admin/users/:id', protect, admin, deleteUser);
router.patch('/bookmarks/:postId', protect, toggleBookmark);
router.get('/bookmarks', protect, getBookmarks);
router.get('/admin/analytics/stats', protect, admin, getStats);
router.get('/admin/analytics/growth', protect, admin, getGrowth);
router.get('/admin/analytics/top-authors', protect, admin, getTopAuthors);
router.get('/admin/analytics/activity', protect, admin, getRecentActivity);
router.patch('/follow/:id', protect, followUser);
router.get('/:id/followers', getFollowers);
router.get('/:id/following', getFollowing);
router.get('/following/feed', protect, getFollowingFeed);
router.get('/users/search', searchUsers);
router.get('/users/:id/public', getUserProfilePublic);
router.get('/:userId/engagements', getUserEngagements);
router.get('/:id', getUserProfile);
module.exports = router; 