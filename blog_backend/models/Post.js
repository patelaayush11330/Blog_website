const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tags: [{ type: String }],
  thumbnail: { type: String },
  likes: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, count: { type: Number, default: 1 } }],
  featured: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  membersOnly: { type: Boolean, default: false },
  memberReads: { type: Number, default: 0 },
  earnings: { type: Number, default: 0 },
  status: { type: String, enum: ['published', 'hidden', 'pending', 'rejected'], default: 'published' },
}, { timestamps: true });

// Add text index for full-text search
postSchema.index({ title: 'text', content: 'text' });

module.exports = mongoose.model('Post', postSchema); 