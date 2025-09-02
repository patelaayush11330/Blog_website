const Comment = require('../models/Comment');
const Post = require('../models/Post');
const Notification = require('../models/Notification');

// Create a new comment (supports replies)
exports.createComment = async (req, res) => {
  try {
    const { content, parent } = req.body;
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const comment = await Comment.create({
      post: postId,
      user: req.user._id,
      content,
      parent: parent || null,
    });
    if (post.author.toString() !== req.user._id.toString()) {
      await Notification.create({
        user: post.author,
        type: 'comment',
        message: `${req.user.name} commented on your post: "${post.title}"`,
      });
    }
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all comments for a post (threaded)
exports.getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ post: postId })
      .populate('user', 'name avatar')
      .sort({ createdAt: 1 });
    // Build threaded structure
    const commentMap = {};
    comments.forEach(c => commentMap[c._id] = { ...c._doc, replies: [] });
    const roots = [];
    comments.forEach(c => {
      if (c.parent) {
        commentMap[c.parent]?.replies.push(commentMap[c._id]);
      } else {
        roots.push(commentMap[c._id]);
      }
    });
    res.json(roots);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a comment
// exports.deleteComment = async (req, res) => {
//   try {
//     const comment = await Comment.findById(req.params.id);
//     if (!comment) return res.status(404).json({ message: 'Comment not found' });
//     if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
//       return res.status(403).json({ message: 'Not authorized' });
//     }
//     await comment.remove();
//     res.json({ message: 'Comment deleted' });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
exports.deleteComment = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Unauthorized - user not found' });
    }

    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (!comment.user || (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin')) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await comment.deleteOne();
    res.status(200).json({ message: 'Comment deleted' });
  } catch (err) {
    console.error("Error deleting comment:", err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


// Admin: Get all comments
exports.getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate('user', 'name email role')
      .populate('post', 'title')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: Get comment analytics
exports.getCommentAnalytics = async (req, res) => {
  try {
    const totalComments = await Comment.countDocuments();
    const commentsByMonth = await Comment.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } },
      { $limit: 12 }
    ]);
    const topCommenters = await Comment.aggregate([
      {
        $group: {
          _id: '$user',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          name: '$user.name',
          email: '$user.email',
          commentCount: '$count'
        }
      }
    ]);
    
    res.json({
      totalComments,
      commentsByMonth,
      topCommenters
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 