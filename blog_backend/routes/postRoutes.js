const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const { createPost, getAllPosts, getSinglePost, updatePost, deletePost, toggleLike, adminGetAllPosts, getTrendingPosts, getFeaturedPosts, setFeatured, incrementViews, searchPosts, getPostOpenGraph, reportPost, getUserPostsAnalytics } = require('../controllers/postController');
const rateLimit = require('../middleware/rateLimit');

const router = express.Router();

router.post('/', protect, rateLimit(req => req.user._id, 5, 60 * 1000), createPost);
router.get('/', getAllPosts);
router.get('/user/:userId/analytics', require('../controllers/postController').getUserPostsAnalytics);
router.get('/:id', getSinglePost);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);
router.patch('/:id/like', protect, toggleLike);
router.patch('/:id/clap', protect, require('../controllers/postController').toggleClap);
router.post('/:id/report', protect, rateLimit(req => req.user._id + ':report', 5, 60 * 1000), reportPost);
router.get('/admin/all', protect, admin, adminGetAllPosts);
router.get('/trending', getTrendingPosts);
router.get('/featured', getFeaturedPosts);
router.patch('/:id/featured', protect, admin, setFeatured);
router.patch('/:id/view', incrementViews);
router.get('/search', searchPosts);
router.get('/:id/og', getPostOpenGraph);
router.get('/recommended', protect, require('../controllers/postController').getRecommendedPosts);
router.get('/admin/reported', protect, admin, require('../controllers/postController').getReportedPosts);
router.patch('/:id/status', protect, admin, require('../controllers/postController').updatePostStatus);

module.exports = router; 