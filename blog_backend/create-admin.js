const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@bloghub.com' });
    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email: admin@bloghub.com');
      console.log('Password: admin123456');
      process.exit(0);
    }

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@bloghub.com',
      password: 'admin123456',
      role: 'admin',
      bio: 'System Administrator'
    });

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@bloghub.com');
    console.log('🔑 Password: admin123456');
    console.log('👑 Role: admin');
    console.log('\n⚠️  Please change the password after first login!');

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

createAdminUser(); 