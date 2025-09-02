const Post = require('../models/Post');
const Notification = require('../models/Notification');
const User = require('../models/User');
const Report = require('../models/Report');
const mongoose = require('mongoose');
const Comment = require('../models/Comment');
// Create a new post
exports.createPost = async (req, res) => {
  try {
    console.log('📝 Creating post:', { title: req.body.title, author: req.user._id });
    
    const { title, content, tags, thumbnail } = req.body;
    const post = await Post.create({
      title,
      content,
      tags,
      thumbnail,
      author: req.user._id,
    });
    
    // Populate author info before sending response
    await post.populate('author', 'name avatar');
    
    console.log('✅ Post created successfully:', post._id);
    res.status(201).json(post);
  } catch (err) {
    console.error('❌ Post creation error:', err);
    res.status(500).json({ message: err.message });
  }
};

// Get all posts (with search and tag filter)
exports.getAllPosts = async (req, res) => {
  try {
    const { search, tag } = req.query;
    let query = { status: 'published' };
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    if (tag) {
      query.tags = tag;
    }
    const posts = await Post.find(query).populate('author', 'name avatar').sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single post by ID
exports.getSinglePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name avatar');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    // Track member reads and earnings
    if (post.membersOnly && req.user && req.user.membership && req.user.membership.status === 'active') {
      post.memberReads = (post.memberReads || 0) + 1;
      post.earnings = (post.earnings || 0) + 10; // ₹10 per member read
      await post.save();
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update post
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const { title, content, tags, thumbnail } = req.body;
    if (title) post.title = title;
    if (content) post.content = content;
    if (tags) post.tags = tags;
    if (thumbnail) post.thumbnail = thumbnail;
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// // Delete post
// exports.deletePost = async (req, res) => {
//   try {
//     const post = await Post.findById(req.params.id);
//     if (!post) return res.status(404).json({ message: 'Post not found' });
//     if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
//       return res.status(403).json({ message: 'Not authorized' });
//     }
//     await post.remove();
//     if (req.user.role === 'admin' && post.author.toString() !== req.user._id.toString()) {
//       await Notification.create({
//         user: post.author,
//         type: 'admin',
//         message: `Your post "${post.title}" was deleted by admin.`,
//       });
//     }
//     res.json({ message: 'Post deleted' });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// Get all posts by a user with views and comments count
exports.getUserPostsAnalytics = async (req, res) => {
  try {
    const userId = req.params.userId;
    // Get all posts by this user
    const posts = await Post.find({ author: userId }).sort({ createdAt: -1 });

    // For each post, get the comments count
    const postsWithAnalytics = await Promise.all(
      posts.map(async post => {
        const commentsCount = await Comment.countDocuments({ post: post._id });
        return {
          _id: post._id,
          title: post.title,
          views: post.views || 0,
          commentsCount,
          createdAt: post.createdAt,
          status: post.status,
          likes: Array.isArray(post.likes) ? post.likes.length : 0,
          // Add other fields if needed
        };
      })
    );

    res.json(postsWithAnalytics);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Toggle like/unlike a post
exports.toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const userId = req.user._id.toString();
    const liked = post.likes.map(id => id.toString()).includes(userId);
    if (liked) {
      post.likes = post.likes.filter(id => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }
    await post.save();
    if (!liked && post.author.toString() !== req.user._id.toString()) {
      await Notification.create({
        user: post.author,
        type: 'like',
        message: `${req.user.name} liked your post: "${post.title}"`,
      });
    }
    res.json({
      likesCount: post.likes.length,
      liked: !liked,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Toggle clap (like) a post (Medium-style)
exports.toggleClap = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const userId = req.user._id.toString();
    let userLike = post.likes.find(like => like.user.toString() === userId);
    if (userLike) {
      if (userLike.count < 50) {
        userLike.count += 1;
      }
    } else {
      post.likes.push({ user: req.user._id, count: 1 });
    }
    await post.save();
    const totalClaps = post.likes.reduce((sum, l) => sum + (l.count || 1), 0);
    const userClaps = post.likes.find(l => l.user.toString() === userId)?.count || 0;
    res.json({
      totalClaps,
      userClaps
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: Get all posts
exports.adminGetAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'name email role').sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get trending posts (top 10 by likes/views)
exports.getTrendingPosts = async (req, res) => {
  try {
    const posts = await Post.find({ status: 'published' })
      .sort({ likes: -1, views: -1, createdAt: -1 })
      .limit(10)
      .populate('author', 'name avatar');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get featured posts
exports.getFeaturedPosts = async (req, res) => {
  try {
    const posts = await Post.find({ featured: true, status: 'published' })
      .sort({ createdAt: -1 })
      .populate('author', 'name avatar');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: Set/unset featured
exports.setFeatured = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    post.featured = req.body.featured;
    await post.save();
    res.json({ message: `Post ${post.featured ? 'featured' : 'unfeatured'}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Increment views
exports.incrementViews = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json({ views: post.views });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Full-text search and advanced filters
exports.searchPosts = async (req, res) => {
  try {
    const { q, tag, author, startDate, endDate } = req.query;
    let query = { status: 'published' };
    let authorIds = [];
    if (q) {
      // Find users whose name matches the query
      const users = await User.find({ name: { $regex: q, $options: 'i' } }).select('_id');
      authorIds = users.map(u => u._id);
      // Search posts by text or author
      query.$or = [
        { $text: { $search: q } },
        { author: { $in: authorIds } }
      ];
    }
    if (tag) {
      query.tags = tag;
    }
    if (author) {
      query.author = author;
    }
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    const posts = await Post.find(query)
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 });
    // Remove duplicate posts (if any)
    const uniquePosts = Array.from(new Map(posts.map(p => [p._id.toString(), p])).values());
    res.json(uniquePosts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Open Graph meta info for a post
exports.getPostOpenGraph = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const og = {
      title: post.title,
      description: post.content.replace(/<[^>]+>/g, '').slice(0, 150) + '...',
      image: post.thumbnail || '',
      author: post.author.name,
      createdAt: post.createdAt,
      url: `${req.protocol}://${req.get('host')}/posts/${post._id}`
    };
    res.json(og);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: Bulk delete posts
exports.bulkDeletePosts = async (req, res) => {
  try {
    const { postIds } = req.body;
    if (!postIds || !Array.isArray(postIds)) {
      return res.status(400).json({ message: 'Post IDs array required' });
    }
    await Post.deleteMany({ _id: { $in: postIds } });
    res.json({ message: `${postIds.length} posts deleted` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: Get post analytics
exports.getPostAnalytics = async (req, res) => {
  try {
    const totalPosts = await Post.countDocuments();
    const featuredPosts = await Post.countDocuments({ featured: true });
    const postsByMonth = await Post.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } },
      { $limit: 12 }
    ]);
    const topPosts = await Post.find()
      .sort({ views: -1, likes: -1 })
      .limit(10)
      .populate('author', 'name');
    
    res.json({
      totalPosts,
      featuredPosts,
      postsByMonth,
      topPosts
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 

// Get recommended posts for a user (posts from followed authors)
exports.getRecommendedPosts = async (req, res) => {
  try {
    // Get the current user and their following list
    const user = await User.findById(req.user._id).populate('following');
    if (!user) return res.status(404).json({ message: 'User not found' });
    const followingIds = user.following.map(u => u._id);
    if (followingIds.length === 0) {
      // If not following anyone, return trending posts as fallback
      const trending = await Post.find({ status: 'published' })
        .sort({ likes: -1, views: -1, createdAt: -1 })
        .limit(10)
        .populate('author', 'name avatar');
      return res.json(trending);
    }
    // Fetch posts from followed authors
    const posts = await Post.find({ author: { $in: followingIds }, status: 'published' })
      .sort({ createdAt: -1 })
      .populate('author', 'name avatar');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 

exports.reportPost = async (req, res) => {
  try {
    const { reason, comment } = req.body;
    const postId = req.params.id;
    const reporterId = req.user._id;
    // Prevent duplicate report by same user
    const existing = await Report.findOne({ post: postId, reporter: reporterId });
    if (existing) return res.status(400).json({ message: 'You have already reported this post.' });
    await Report.create({ post: postId, reporter: reporterId, reason, comment });
    res.status(201).json({ message: 'Report submitted.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 

exports.getReportedPosts = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('post')
      .populate('reporter', 'name email');
    // Group by post
    const grouped = {};
    reports.forEach(r => {
      if (!grouped[r.post?._id]) grouped[r.post?._id] = { post: r.post, reports: [] };
      grouped[r.post?._id].reports.push({
        _id: r._id,
        reporter: r.reporter,
        reason: r.reason,
        comment: r.comment,
        createdAt: r.createdAt
      });
    });
    res.json(Object.values(grouped));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updatePostStatus = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    post.status = req.body.status;
    await post.save();
    // Notify author if hidden or rejected
    if (['hidden', 'rejected'].includes(post.status)) {
      await Notification.create({
        user: post.author,
        type: 'admin',
        message: `Your post "${post.title}" was ${post.status} by admin.`
      });
    }
    res.json({ message: `Post status updated to ${post.status}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 

//DELETE POST
exports.deletePost = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid post ID' });
    }
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await post.deleteOne(); // Use deleteOne instead of remove
    if (req.user.role === 'admin' && post.author.toString() !== req.user._id.toString()) {
      await Notification.create({
        user: post.author,
        type: 'admin',
        message: `Your post "${post.title}" was deleted by admin.`,
      });
    }
    res.json({ message: 'Post deleted' });
  } catch (err) {
    console.error('Delete Post Error:', err);
    res.status(500).json({ message: err.message });
  }
};
