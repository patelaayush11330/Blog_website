require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Import routes
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const userRoutes = require('./routes/userRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const imageUploadRoutes = require('./routes/imageUploadRoutes');
const Post = require('./models/Post');

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' })); // or higher if needed
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors());

// Static files (for uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
app.get('/', (req, res) => {
  res.send('Blog Backend API is running');
});

// Dynamic sitemap
app.get('/sitemap.xml', async (req, res) => {
  try {
    const posts = await Post.find({}, 'slug _id updatedAt');
    const baseUrl = process.env.FRONTEND_URL || 'https://yourdomain.com';
    let urls = [
      `<url><loc>${baseUrl}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>`
    ];
    posts.forEach(post => {
      urls.push(
        `<url><loc>${baseUrl}/post/${post.slug || post._id}</loc><lastmod>${post.updatedAt ? post.updatedAt.toISOString() : ''}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`
      );
    });
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}</urlset>`;
    res.header('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (err) {
    res.status(500).send('Could not generate sitemap');
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', imageUploadRoutes);

// 404 Handler for unknown routes
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global Error Handler (optional, for catching thrown errors)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error', error: err.message });
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('MongoDB connected');
  // Start server only after DB connection
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1); // Exit process if DB connection fails
});

// require('dotenv').config();

// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const path = require('path');
// const session = require('express-session');
// const MongoStore = require('connect-mongo');

// // Import routes
// const authRoutes = require('./routes/authRoutes');
// const postRoutes = require('./routes/postRoutes');
// const commentRoutes = require('./routes/commentRoutes');
// const userRoutes = require('./routes/userRoutes');
// const notificationRoutes = require('./routes/notificationRoutes');
// const adminRoutes = require('./routes/adminRoutes');
// const imageUploadRoutes = require('./routes/imageUploadRoutes');
// const Post = require('./models/Post');

// const app = express();

// // Middleware setup
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET || 'your-secret-key',
//     resave: false,
//     saveUninitialized: false,
//     store: MongoStore.create({
//       mongoUrl: process.env.MONGO_URI,
//       ttl: 24 * 60 * 60, // 1 day session duration
//       autoRemove: 'native'
//     }),
//     cookie: {
//       maxAge: 24 * 60 * 60 * 1000, // 1 day
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'lax'
//     }
//   })
// );

// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// app.use(cors({
//   credentials: true,
//   origin: process.env.FRONTEND_URL || 'http://localhost:3000'
// }));

// // Static files
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Clear session on server start
// app.use((req, res, next) => {
//   req.session.destroy();
//   next();
// });

// // Routes
// app.get('/', (req, res) => {
//   res.send('Blog Backend API is running');
// });

// // Sitemap
// app.get('/sitemap.xml', async (req, res) => {
//   try {
//     const posts = await Post.find({}, 'slug _id updatedAt');
//     const baseUrl = process.env.FRONTEND_URL || 'https://yourdomain.com';
//     let urls = [
//       `<url><loc>${baseUrl}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>`
//     ];
//     posts.forEach(post => {
//       urls.push(
//         `<url><loc>${baseUrl}/post/${post.slug || post._id}</loc><lastmod>${post.updatedAt ? post.updatedAt.toISOString() : ''}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`
//       );
//     });
//     const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}</urlset>`;
//     res.header('Content-Type', 'application/xml');
//     res.send(sitemap);
//   } catch (err) {
//     res.status(500).send('Could not generate sitemap');
//   }
// });

// // API routes
// app.use('/api/auth', authRoutes);
// app.use('/api/posts', postRoutes);
// app.use('/api/comments', commentRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/notifications', notificationRoutes);
// app.use('/api/admin', adminRoutes);
// app.use('/api/upload', imageUploadRoutes);

// // Error handlers
// app.use((req, res) => {
//   res.status(404).json({ message: 'Route not found' });
// });

// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ message: 'Server error', error: err.message });
// });

// // Database connection
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(async () => {
//   console.log('MongoDB connected');
  
//   const sessionStore = MongoStore.create({ mongoUrl: process.env.MONGO_URI });
//   await sessionStore.clear();
//   console.log('Previous sessions cleared');

//   const PORT = process.env.PORT || 5000;
//   app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
//   });
// })
// .catch((err) => {
//   console.error('MongoDB connection error:', err);
//   process.exit(1);
// });
