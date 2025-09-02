const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { createComment, getCommentsByPost, deleteComment } = require('../controllers/commentController');
const rateLimit = require('../middleware/rateLimit');

const router = express.Router();

router.post('/:postId', protect, rateLimit(req => req.user._id + ':comment', 5, 60 * 1000), createComment);
router.get('/:postId', getCommentsByPost);
router.delete('/:id', protect, deleteComment);

module.exports = router; 