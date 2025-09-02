# 🗄️ BlogHub MongoDB Queries Guide

## 📊 Database Collections

### 1. **Users Collection**
```javascript
// Collection: users
// Schema: User.js

// Create new user
db.users.insertOne({
  name: "John Doe",
  email: "john@example.com",
  password: "hashed_password",
  avatar: "https://example.com/avatar.jpg",
  role: "user", // or "admin"
  isBanned: false,
  bio: "Software Developer",
  bookmarks: [],
  followers: [],
  following: [],
  createdAt: new Date()
})

// Find user by email
db.users.findOne({ email: "john@example.com" })

// Find admin users
db.users.find({ role: "admin" })

// Find banned users
db.users.find({ isBanned: true })

// Update user role to admin
db.users.updateOne(
  { _id: ObjectId("user_id") },
  { $set: { role: "admin" } }
)

// Ban a user
db.users.updateOne(
  { _id: ObjectId("user_id") },
  { $set: { isBanned: true } }
)

// Get user with posts count
db.users.aggregate([
  {
    $lookup: {
      from: "posts",
      localField: "_id",
      foreignField: "author",
      as: "posts"
    }
  },
  {
    $project: {
      name: 1,
      email: 1,
      postsCount: { $size: "$posts" }
    }
  }
])

// Get top users by followers
db.users.aggregate([
  {
    $project: {
      name: 1,
      followersCount: { $size: "$followers" }
    }
  },
  { $sort: { followersCount: -1 } },
  { $limit: 10 }
])
```

### 2. **Posts Collection**
```javascript
// Collection: posts
// Schema: Post.js

// Create new post
db.posts.insertOne({
  title: "My First Blog Post",
  content: "This is the content of my blog post...",
  author: ObjectId("user_id"),
  tags: ["technology", "programming"],
  thumbnail: "https://example.com/thumbnail.jpg",
  featured: false,
  likes: [],
  views: 0,
  createdAt: new Date()
})

// Find posts by author
db.posts.find({ author: ObjectId("user_id") })

// Find featured posts
db.posts.find({ featured: true })

// Find posts by tag
db.posts.find({ tags: "technology" })

// Search posts by title
db.posts.find({ 
  title: { $regex: "blog", $options: "i" } 
})

// Get posts with author info
db.posts.aggregate([
  {
    $lookup: {
      from: "users",
      localField: "author",
      foreignField: "_id",
      as: "author"
    }
  },
  { $unwind: "$author" },
  {
    $project: {
      title: 1,
      content: 1,
      "author.name": 1,
      "author.avatar": 1,
      likes: 1,
      views: 1
    }
  }
])

// Get trending posts (by likes and views)
db.posts.aggregate([
  {
    $addFields: {
      likesCount: { $size: "$likes" },
      score: { 
        $add: [
          { $size: "$likes" },
          { $multiply: ["$views", 0.1] }
        ]
      }
    }
  },
  { $sort: { score: -1 } },
  { $limit: 10 }
])

// Get posts by date range
db.posts.find({
  createdAt: {
    $gte: new Date("2024-01-01"),
    $lte: new Date("2024-12-31")
  }
})

// Update post views
db.posts.updateOne(
  { _id: ObjectId("post_id") },
  { $inc: { views: 1 } }
)

// Add like to post
db.posts.updateOne(
  { _id: ObjectId("post_id") },
  { $addToSet: { likes: ObjectId("user_id") } }
)

// Remove like from post
db.posts.updateOne(
  { _id: ObjectId("post_id") },
  { $pull: { likes: ObjectId("user_id") } }
)
```

### 3. **Comments Collection**
```javascript
// Collection: comments
// Schema: Comment.js

// Create new comment
db.comments.insertOne({
  post: ObjectId("post_id"),
  user: ObjectId("user_id"),
  content: "Great post!",
  parent: null, // for replies
  createdAt: new Date()
})

// Create reply comment
db.comments.insertOne({
  post: ObjectId("post_id"),
  user: ObjectId("user_id"),
  content: "Thanks for the reply!",
  parent: ObjectId("parent_comment_id"),
  createdAt: new Date()
})

// Get comments for a post
db.comments.find({ post: ObjectId("post_id") })

// Get comments with user info
db.comments.aggregate([
  {
    $lookup: {
      from: "users",
      localField: "user",
      foreignField: "_id",
      as: "user"
    }
  },
  { $unwind: "$user" },
  {
    $project: {
      content: 1,
      "user.name": 1,
      "user.avatar": 1,
      createdAt: 1
    }
  }
])

// Get threaded comments
db.comments.aggregate([
  { $match: { post: ObjectId("post_id") } },
  {
    $lookup: {
      from: "users",
      localField: "user",
      foreignField: "_id",
      as: "user"
    }
  },
  { $unwind: "$user" },
  {
    $group: {
      _id: "$parent",
      comments: { $push: "$$ROOT" }
    }
  }
])
```

### 4. **Notifications Collection**
```javascript
// Collection: notifications
// Schema: Notification.js

// Create notification
db.notifications.insertOne({
  user: ObjectId("user_id"),
  type: "like", // like, comment, follow, admin
  message: "John liked your post",
  read: false,
  createdAt: new Date()
})

// Get unread notifications
db.notifications.find({ 
  user: ObjectId("user_id"),
  read: false 
})

// Mark notification as read
db.notifications.updateOne(
  { _id: ObjectId("notification_id") },
  { $set: { read: true } }
)

// Mark all notifications as read
db.notifications.updateMany(
  { user: ObjectId("user_id") },
  { $set: { read: true } }
)
```

## 📈 **Analytics Queries**

### User Analytics
```javascript
// Get user growth (last 30 days)
db.users.aggregate([
  {
    $match: {
      createdAt: {
        $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      }
    }
  },
  {
    $group: {
      _id: {
        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
      },
      count: { $sum: 1 }
    }
  },
  { $sort: { _id: 1 } }
])

// Get user engagement
db.users.aggregate([
  {
    $lookup: {
      from: "posts",
      localField: "_id",
      foreignField: "author",
      as: "posts"
    }
  },
  {
    $lookup: {
      from: "comments",
      localField: "_id",
      foreignField: "user",
      as: "comments"
    }
  },
  {
    $project: {
      name: 1,
      postsCount: { $size: "$posts" },
      commentsCount: { $size: "$comments" },
      totalLikes: {
        $sum: {
          $map: {
            input: "$posts",
            as: "post",
            in: { $size: "$$post.likes" }
          }
        }
      }
    }
  }
])
```

### Post Analytics
```javascript
// Get post performance
db.posts.aggregate([
  {
    $addFields: {
      likesCount: { $size: "$likes" },
      engagementRate: {
        $divide: [
          { $size: "$likes" },
          { $max: ["$views", 1] }
        ]
      }
    }
  },
  { $sort: { engagementRate: -1 } },
  { $limit: 10 }
])

// Get posts by month
db.posts.aggregate([
  {
    $group: {
      _id: {
        $dateToString: { format: "%Y-%m", date: "$createdAt" }
      },
      count: { $sum: 1 },
      totalViews: { $sum: "$views" },
      totalLikes: { $sum: { $size: "$likes" } }
    }
  },
  { $sort: { _id: -1 } }
])
```

## 🔍 **Search Queries**

### Full-Text Search
```javascript
// Create text index
db.posts.createIndex({
  title: "text",
  content: "text"
})

// Search posts
db.posts.find({
  $text: { $search: "javascript programming" }
})

// Search with relevance score
db.posts.aggregate([
  {
    $match: {
      $text: { $search: "javascript programming" }
    }
  },
  {
    $addFields: {
      score: { $meta: "textScore" }
    }
  },
  { $sort: { score: { $meta: "textScore" } } }
])
```

## 🛡️ **Security Queries**

### User Authentication
```javascript
// Find user by email (for login)
db.users.findOne({ 
  email: "user@example.com" 
})

// Check if user is banned
db.users.findOne({
  email: "user@example.com",
  isBanned: false
})

// Get user with role
db.users.findOne(
  { email: "user@example.com" },
  { password: 0 } // exclude password
)
```

## 📊 **Admin Dashboard Queries**

### Platform Statistics
```javascript
// Get total counts
db.users.countDocuments()
db.posts.countDocuments()
db.comments.countDocuments()

// Get admin stats
db.users.aggregate([
  {
    $facet: {
      totalUsers: [{ $count: "count" }],
      adminUsers: [{ $match: { role: "admin" } }, { $count: "count" }],
      bannedUsers: [{ $match: { isBanned: true } }, { $count: "count" }]
    }
  }
])

// Get top content creators
db.users.aggregate([
  {
    $lookup: {
      from: "posts",
      localField: "_id",
      foreignField: "author",
      as: "posts"
    }
  },
  {
    $project: {
      name: 1,
      postsCount: { $size: "$posts" },
      totalLikes: {
        $sum: {
          $map: {
            input: "$posts",
            as: "post",
            in: { $size: "$$post.likes" }
          }
        }
      }
    }
  },
  { $sort: { postsCount: -1 } },
  { $limit: 5 }
])
```

## 🚀 **Performance Optimization**

### Indexes
```javascript
// Create indexes for better performance
db.users.createIndex({ email: 1 })
db.users.createIndex({ role: 1 })
db.users.createIndex({ createdAt: -1 })

db.posts.createIndex({ author: 1 })
db.posts.createIndex({ tags: 1 })
db.posts.createIndex({ createdAt: -1 })
db.posts.createIndex({ featured: 1 })
db.posts.createIndex({ likes: 1 })

db.comments.createIndex({ post: 1 })
db.comments.createIndex({ user: 1 })
db.comments.createIndex({ parent: 1 })

db.notifications.createIndex({ user: 1, read: 1 })
db.notifications.createIndex({ createdAt: -1 })
```

## 📝 **Usage Examples**

### In Controllers
```javascript
// Example: Get user profile with posts
const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select('-password');
  const posts = await Post.find({ author: userId })
    .sort({ createdAt: -1 })
    .populate('author', 'name avatar');
  
  return { user, posts };
};

// Example: Get trending posts
const getTrendingPosts = async () => {
  return await Post.aggregate([
    {
      $addFields: {
        likesCount: { $size: '$likes' },
        score: { 
          $add: [
            { $size: '$likes' },
            { $multiply: ['$views', 0.1] }
          ]
        }
      }
    },
    { $sort: { score: -1 } },
    { $limit: 10 },
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
};
``` 