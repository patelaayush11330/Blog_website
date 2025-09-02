const mongoose = require('mongoose');
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const runQueries = async () => {
  try {
    console.log('🔗 Connected to MongoDB Atlas');
    console.log('📊 Running BlogHub Queries...\n');

    // 1. Get total users count
    const totalUsers = await User.countDocuments();
    console.log('👥 Total Users:', totalUsers);

    // 2. Get admin users
    const adminUsers = await User.find({ role: 'admin' });
    console.log('👑 Admin Users:', adminUsers.length);
    adminUsers.forEach(user => {
      console.log(`   - ${user.name} (${user.email})`);
    });

    // 3. Get total posts count
    const totalPosts = await Post.countDocuments();
    console.log('\n📝 Total Posts:', totalPosts);

    // 4. Get featured posts
    const featuredPosts = await Post.find({ featured: true });
    console.log('⭐ Featured Posts:', featuredPosts.length);

    // 5. Get posts with most likes
    const topPosts = await Post.aggregate([
      {
        $addFields: {
          likesCount: { $size: '$likes' }
        }
      },
      { $sort: { likesCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'author'
        }
      },
      { $unwind: '$author' }
    ]);

    console.log('\n🔥 Top Posts by Likes:');
    topPosts.forEach((post, index) => {
      console.log(`   ${index + 1}. "${post.title}" by ${post.author.name} (${post.likesCount} likes)`);
    });

    // 6. Get user engagement stats
    const userStats = await User.aggregate([
      {
        $lookup: {
          from: 'posts',
          localField: '_id',
          foreignField: 'author',
          as: 'posts'
        }
      },
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'user',
          as: 'comments'
        }
      },
      {
        $project: {
          name: 1,
          email: 1,
          postsCount: { $size: '$posts' },
          commentsCount: { $size: '$comments' },
          totalLikes: {
            $sum: {
              $map: {
                input: '$posts',
                as: 'post',
                in: { $size: '$$post.likes' }
              }
            }
          }
        }
      },
      { $sort: { postsCount: -1 } },
      { $limit: 5 }
    ]);

    console.log('\n📈 Top Content Creators:');
    userStats.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.name} - ${user.postsCount} posts, ${user.commentsCount} comments, ${user.totalLikes} total likes`);
    });

    // 7. Get recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentUsers = await User.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    const recentPosts = await Post.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    console.log('\n📅 Recent Activity (Last 7 Days):');
    console.log(`   New Users: ${recentUsers}`);
    console.log(`   New Posts: ${recentPosts}`);

    // 8. Get posts by tags
    const tagStats = await Post.aggregate([
      { $unwind: '$tags' },
      {
        $group: {
          _id: '$tags',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    console.log('\n🏷️ Popular Tags:');
    tagStats.forEach((tag, index) => {
      console.log(`   ${index + 1}. ${tag._id}: ${tag.count} posts`);
    });

    // 9. Get banned users
    const bannedUsers = await User.find({ isBanned: true });
    console.log('\n🚫 Banned Users:', bannedUsers.length);

    // 10. Get total comments
    const totalComments = await Comment.countDocuments();
    console.log('\n💬 Total Comments:', totalComments);

    console.log('\n✅ All queries completed successfully!');

  } catch (error) {
    console.error('❌ Error running queries:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

// Run the queries
runQueries(); 