const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User Queries
const userQueries = async () => {
  try {
    console.log('👥 Running User Queries...\n');

    // 1. Find all users
    console.log('1. All Users:');
    const users = await User.find().select('name email role createdAt');
    users.forEach(user => {
      console.log(`   - ${user.name} (${user.email}) - ${user.role}`);
    });

    // 2. Find admin users
    console.log('\n2. Admin Users:');
    const admins = await User.find({ role: 'admin' });
    admins.forEach(admin => {
      console.log(`   - ${admin.name} (${admin.email})`);
    });

    // 3. Find banned users
    console.log('\n3. Banned Users:');
    const banned = await User.find({ isBanned: true });
    banned.forEach(user => {
      console.log(`   - ${user.name} (${user.email})`);
    });

    // 4. Get user with most followers
    console.log('\n4. Top Users by Followers:');
    const topUsers = await User.aggregate([
      {
        $addFields: {
          followersCount: { $size: '$followers' }
        }
      },
      { $sort: { followersCount: -1 } },
      { $limit: 5 }
    ]);
    topUsers.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.name}: ${user.followersCount} followers`);
    });

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
};

userQueries(); 