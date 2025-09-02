const mongoose = require('mongoose');
const Post = require('../models/Post');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Post Queries
const postQueries = async () => {
  try {
    console.log('📝 Running Post Queries...\n');

    // 1. Get all posts
    console.log('1. All Posts:');
    const posts = await Post.find().populate('author', 'name');
    posts.forEach(post => {
      console.log(`   - "${post.title}" by ${post.author.name} (${post.likes.length} likes)`);
    });

    // 2. Get featured posts
    console.log('\n2. Featured Posts:');
    const featured = await Post.find({ featured: true }).populate('author', 'name');
    featured.forEach(post => {
      console.log(`   - "${post.title}" by ${post.author.name}`);
    });

    // 3. Get posts by tag
    console.log('\n3. Posts by Tag (technology):');
    const techPosts = await Post.find({ tags: 'technology' }).populate('author', 'name');
    techPosts.forEach(post => {
      console.log(`   - "${post.title}" by ${post.author.name}`);
    });

    // 4. Get trending posts
    console.log('\n4. Trending Posts (by likes):');
    const trending = await Post.aggregate([
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
    trending.forEach((post, index) => {
      console.log(`   ${index + 1}. "${post.title}" by ${post.author.name} (${post.likesCount} likes)`);
    });

    // 5. Get posts by date range
    console.log('\n5. Recent Posts (last 7 days):');
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recent = await Post.find({
      createdAt: { $gte: sevenDaysAgo }
    }).populate('author', 'name');
    recent.forEach(post => {
      console.log(`   - "${post.title}" by ${post.author.name}`);
    });

    // 6. Search posts by title
    console.log('\n6. Search Posts (containing "blog"):');
    const searchResults = await Post.find({
      title: { $regex: 'blog', $options: 'i' }
    }).populate('author', 'name');
    searchResults.forEach(post => {
      console.log(`   - "${post.title}" by ${post.author.name}`);
    });

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
};

postQueries(); 