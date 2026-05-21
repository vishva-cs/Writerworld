const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Chapter title is required'],
    trim: true,
  },
  chapterNumber: {
    type: Number,
    required: true,
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
  },
  content: {
    type: String,
    required: [true, 'Chapter content is required'],
  },
  htmlContent: String,
  summary: String,
  wordCount: {
    type: Number,
    default: 0,
  },
  readTime: {
    type: Number,
    default: 0, // in minutes
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
  publishedAt: Date,
  views: {
    type: Number,
    default: 0,
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
  hasAIEnhancements: {
    type: Boolean,
    default: false,
  },
  aiSuggestions: [{
    type: {
      type: String, // 'grammar', 'style', 'improvement'
      enum: ['grammar', 'style', 'improvement', 'summary'],
    },
    text: String,
    suggestion: String,
    confidence: Number,
  }],
  autoSaveContent: String,
  autoSaveTime: Date,
  isAutoSaved: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

// Calculate read time (assuming 200 words per minute)
chapterSchema.methods.calculateReadTime = function() {
  const wordCount = this.content.split(/\s+/).length;
  this.wordCount = wordCount;
  this.readTime = Math.ceil(wordCount / 200);
};

module.exports = mongoose.model('Chapter', chapterSchema);
