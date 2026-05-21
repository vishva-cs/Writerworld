const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Book title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters'],
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  description: {
    type: String,
    required: [true, 'Book description is required'],
    minlength: [20, 'Description must be at least 20 characters'],
    maxlength: [5000, 'Description cannot exceed 5000 characters'],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  coverImage: {
    type: String,
    default: 'https://via.placeholder.com/300x400',
  },
  category: {
    type: String,
    enum: ['fiction', 'non-fiction', 'fantasy', 'romance', 'thriller', 'science-fiction', 'biography', 'self-help', 'poetry', 'other'],
    default: 'other',
  },
  subcategory: String,
  language: {
    type: String,
    enum: ['en', 'te'],
    default: 'en',
  },
  chapters: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chapter',
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
  publishedAt: Date,
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  tags: [String],
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    count: {
      type: Number,
      default: 0,
    },
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  likeCount: {
    type: Number,
    default: 0,
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
  }],
  commentCount: {
    type: Number,
    default: 0,
  },
  views: {
    type: Number,
    default: 0,
  },
  readCount: {
    type: Number,
    default: 0,
  },
  avgReadTime: {
    type: Number,
    default: 0,
  },
  wordCount: {
    type: Number,
    default: 0,
  },
  ageRating: {
    type: String,
    enum: ['all', '13+', '16+', '18+'],
    default: 'all',
  },
  isAIGenerated: {
    type: Boolean,
    default: false,
  },
  aiModel: String,
  aiPrompt: String,
  price: {
    type: Number,
    default: 0,
  },
  isPremiumContent: {
    type: Boolean,
    default: false,
  },
  isTrending: {
    type: Boolean,
    default: false,
  },
  trendingScore: {
    type: Number,
    default: 0,
  },
  relatedBooks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
  }],
  metadata: {
    seoTitle: String,
    seoDescription: String,
    seoKeywords: [String],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

// Index for search functionality
bookSchema.index({ title: 'text', description: 'text', tags: 'text' });
bookSchema.index({ author: 1, status: 1 });
bookSchema.index({ isPublished: 1, isTrending: 1 });
bookSchema.index({ createdAt: -1 });
bookSchema.index({ 'rating.average': -1 });

// Calculate trending score
bookSchema.methods.updateTrendingScore = function() {
  const now = Date.now();
  const daysOld = (now - this.createdAt) / (1000 * 60 * 60 * 24);
  const recencyScore = Math.max(0, 100 - daysOld);
  const engagementScore = (this.likeCount * 2) + (this.commentCount * 3) + (this.views / 10);
  this.trendingScore = (recencyScore * 0.3) + (engagementScore * 0.7);
  this.isTrending = this.trendingScore > 50;
};

module.exports = mongoose.model('Book', bookSchema);
