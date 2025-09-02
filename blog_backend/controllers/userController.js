const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

// Get user profile by ID (public)
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    const posts = await Post.find({ author: user._id }).sort({ createdAt: -1 });
    res.json({ user, posts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get current user profile (protected)
exports.getCurrentUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update current user profile (protected)
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const { name, avatar, bio } = req.body;
    if (name) user.name = name;
    if (avatar) user.avatar = avatar;
    if (bio) user.bio = bio;
    await user.save();
    res.json({ message: 'Profile updated', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Toggle bookmark for a post
exports.toggleBookmark = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const postId = req.params.postId;
    if (!user) return res.status(404).json({ message: 'User not found' });
    const alreadyBookmarked = user.bookmarks.map(id => id.toString()).includes(postId);
    if (alreadyBookmarked) {
      user.bookmarks = user.bookmarks.filter(id => id.toString() !== postId);
    } else {
      user.bookmarks.push(postId);
    }
    await user.save();
    res.json({
      bookmarked: !alreadyBookmarked,
      bookmarks: user.bookmarks,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all bookmarked posts for current user
exports.getBookmarks = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'bookmarks',
      populate: { path: 'author', select: 'name avatar' },
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.bookmarks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: Get platform stats
exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPosts = await Post.countDocuments();
    const totalComments = await Comment.countDocuments();
    const totalLikes = await Post.aggregate([
      { $project: { likesCount: { $size: '$likes' } } },
      { $group: { _id: null, total: { $sum: '$likesCount' } } },
    ]);
    res.json({
      totalUsers,
      totalPosts,
      totalComments,
      totalLikes: totalLikes[0]?.total || 0,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: Get daily growth (last 7 days)
exports.getGrowth = async (req, res) => {
  try {
    const days = 7;
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - days + 1);
    const users = await User.aggregate([
      { $match: { createdAt: { $gte: start } } },
      { $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 },
      } },
      { $sort: { _id: 1 } },
    ]);
    const posts = await Post.aggregate([
      { $match: { createdAt: { $gte: start } } },
      { $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 },
      } },
      { $sort: { _id: 1 } },
    ]);
    const comments = await Comment.aggregate([
      { $match: { createdAt: { $gte: start } } },
      { $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 },
      } },
      { $sort: { _id: 1 } },
    ]);
    res.json({ users, posts, comments });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: Get top authors (by posts and likes)
exports.getTopAuthors = async (req, res) => {
  try {
    const topByPosts = await User.aggregate([
      { $lookup: { from: 'posts', localField: '_id', foreignField: 'author', as: 'posts' } },
      { $project: { name: 1, avatar: 1, postsCount: { $size: '$posts' } } },
      { $sort: { postsCount: -1 } },
      { $limit: 5 },
    ]);
    const topByLikes = await User.aggregate([
      { $lookup: { from: 'posts', localField: '_id', foreignField: 'author', as: 'posts' } },
      { $project: {
        name: 1,
        avatar: 1,
        likesCount: { $sum: { $map: { input: '$posts', as: 'p', in: { $size: '$$p.likes' } } } },
      } },
      { $sort: { likesCount: -1 } },
      { $limit: 5 },
    ]);
    res.json({ topByPosts, topByLikes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Toggle follow/unfollow a user
exports.followUser = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);
    if (!userToFollow || !currentUser) return res.status(404).json({ message: 'User not found' });
    if (userToFollow._id.equals(currentUser._id)) return res.status(400).json({ message: 'Cannot follow yourself' });
    const isFollowing = currentUser.following.includes(userToFollow._id);
    if (isFollowing) {
      currentUser.following.pull(userToFollow._id);
      userToFollow.followers.pull(currentUser._id);
    } else {
      currentUser.following.push(userToFollow._id);
      userToFollow.followers.push(currentUser._id);
    }
    await currentUser.save();
    await userToFollow.save();
    res.json({ following: !isFollowing });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get followers of a user
exports.getFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('followers', 'name avatar');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.followers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get following of a user
exports.getFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('following', 'name avatar');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.following);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get following feed (posts by followed users)
exports.getFollowingFeed = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const posts = await Post.find({ author: { $in: user.following } })
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: Update user role
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User role updated', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: Ban user
exports.banUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBanned: true },
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User banned', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: Unban user
exports.unbanUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBanned: false },
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User unbanned', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: Get recent activity (last 5 users, posts, comments)
exports.getRecentActivity = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).limit(5);
    const posts = await Post.find().sort({ createdAt: -1 }).limit(5);
    const comments = await Comment.find().sort({ createdAt: -1 }).limit(5);
    const activities = [];
    users.forEach(u => activities.push({
      type: 'user',
      date: u.createdAt,
      message: `New user registered: ${u.name}`
    }));
    posts.forEach(p => activities.push({
      type: 'post',
      date: p.createdAt,
      message: `New post published: ${p.title}`
    }));
    comments.forEach(c => activities.push({
      type: 'comment',
      date: c.createdAt,
      message: `New comment added by ${c.user ? c.user : 'a user'}`
    }));
    activities.sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json({ activities: activities.slice(0, 5) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Search users by name or email
exports.searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || !q.trim()) {
      return res.json([]);
    }
    const users = await User.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } }
      ]
    }).select('_id name email avatar');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserProfilePublic = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('followers', 'name avatar')
      .populate('following', 'name avatar');
    if (!user) return res.status(404).json({ message: 'User not found' });
    const posts = await Post.find({ author: user._id }).sort({ createdAt: -1 });
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      posts,
      createdAt: user.createdAt,
      role: user.role
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 

// controllers/userController.js

exports.getUserEngagements = async (req, res) => {
  try {
    const userId = req.params.userId;

    // 1. Total claps received on all user's posts
    const posts = await Post.find({ author: userId });
    const claps = posts.reduce((sum, post) => sum + (post.likes ? post.likes.length : 0), 0);

    // 2. Total comments received on all user's posts
    const comments = await Comment.countDocuments({ post: { $in: posts.map(p => p._id) } });

    // 3. Bookmarks (number of posts the user has bookmarked)
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    const bookmarks = user.bookmarks ? user.bookmarks.length : 0;

    res.json({
      claps,
      comments,
      bookmarks
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
