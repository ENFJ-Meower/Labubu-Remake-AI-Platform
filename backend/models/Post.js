const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: [true, 'Please provide a post title'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Please provide post content'],
    maxlength: [5000, 'Content cannot exceed 5000 characters']
  },
  
  // Author Information
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Post must have an author']
  },
  
  // Post Type & Category
  type: {
    type: String,
    enum: ['text', 'image', 'video', 'audio', 'ai-creation', 'tutorial', 'showcase', 'question', 'discussion'],
    required: [true, 'Please specify post type']
  },
  category: {
    type: String,
    enum: ['general', 'art', 'design', 'ai-agents', 'tutorials', 'showcase', 'feedback', 'help', 'news', 'events'],
    required: [true, 'Please specify post category']
  },
  
  // Media Content
  media: [{
    type: {
      type: String,
      enum: ['image', 'video', 'audio', 'file'],
      required: true
    },
    url: {
      type: String,
      required: true
    },
    filename: String,
    size: Number,
    mimeType: String,
    thumbnail: String,
    alt: String,
    caption: String,
    metadata: {
      width: Number,
      height: Number,
      duration: Number,
      format: String
    }
  }],
  
  // AI-Generated Content
  aiGenerated: {
    isAIGenerated: {
      type: Boolean,
      default: false
    },
    aiAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AIAgent'
    },
    prompt: String,
    model: String,
    settings: {
      temperature: Number,
      maxTokens: Number,
      seed: String
    },
    generationTime: Date
  },
  
  // Status & Visibility
  status: {
    type: String,
    enum: ['draft', 'published', 'hidden', 'archived', 'deleted'],
    default: 'draft'
  },
  visibility: {
    type: String,
    enum: ['public', 'friends', 'private'],
    default: 'public'
  },
  
  // Engagement & Statistics
  stats: {
    views: {
      type: Number,
      default: 0
    },
    likes: {
      type: Number,
      default: 0
    },
    dislikes: {
      type: Number,
      default: 0
    },
    shares: {
      type: Number,
      default: 0
    },
    comments: {
      type: Number,
      default: 0
    },
    bookmarks: {
      type: Number,
      default: 0
    }
  },
  
  // Interactions
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  dislikes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  bookmarks: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Comments
  comments: [{
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      maxlength: [1000, 'Comment cannot exceed 1000 characters']
    },
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post.comments'
    },
    likes: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    replies: [{
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      content: {
        type: String,
        required: true,
        maxlength: [500, 'Reply cannot exceed 500 characters']
      },
      likes: [{
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }],
      createdAt: {
        type: Date,
        default: Date.now
      },
      updatedAt: {
        type: Date,
        default: Date.now
      }
    }],
    isEdited: {
      type: Boolean,
      default: false
    },
    editHistory: [{
      content: String,
      editedAt: {
        type: Date,
        default: Date.now
      }
    }],
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Tags & Keywords
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  keywords: [{
    type: String,
    trim: true,
    maxlength: [50, 'Keyword cannot exceed 50 characters']
  }],
  
  // Location & Context
  location: {
    name: String,
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: '2dsphere'
    }
  },
  
  // Mentions
  mentions: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String,
    position: Number
  }],
  
  // Sharing & Attribution
  originalPost: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  },
  isRepost: {
    type: Boolean,
    default: false
  },
  repostComment: {
    type: String,
    maxlength: [500, 'Repost comment cannot exceed 500 characters']
  },
  
  // Moderation
  moderation: {
    reported: {
      type: Boolean,
      default: false
    },
    reportCount: {
      type: Number,
      default: 0
    },
    reports: [{
      reporter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      reason: {
        type: String,
        enum: ['spam', 'inappropriate', 'harassment', 'copyright', 'misinformation', 'other']
      },
      description: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    moderationNotes: String,
    lastModerated: Date,
    moderatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    contentWarning: {
      enabled: {
        type: Boolean,
        default: false
      },
      reason: String,
      message: String
    }
  },
  
  // SEO & Metadata
  seo: {
    metaTitle: String,
    metaDescription: String,
    slug: {
      type: String,
      unique: true,
      sparse: true
    },
    canonicalUrl: String
  },
  
  // Scheduling
  publishedAt: {
    type: Date,
    default: Date.now
  },
  scheduledFor: Date,
  
  // Featured Status
  featured: {
    type: Boolean,
    default: false
  },
  featuredAt: Date,
  
  // Edit History
  isEdited: {
    type: Boolean,
    default: false
  },
  editHistory: [{
    content: String,
    editedAt: {
      type: Date,
      default: Date.now
    },
    reason: String
  }],
  
  // Activity Tracking
  lastActivity: {
    type: Date,
    default: Date.now
  }
  
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
postSchema.index({ author: 1 });
postSchema.index({ type: 1, category: 1 });
postSchema.index({ status: 1, visibility: 1 });
postSchema.index({ publishedAt: -1 });
postSchema.index({ 'stats.likes': -1 });
postSchema.index({ 'stats.views': -1 });
postSchema.index({ featured: 1, featuredAt: -1 });
postSchema.index({ tags: 1 });
postSchema.index({ keywords: 1 });
postSchema.index({ createdAt: -1 });
postSchema.index({ lastActivity: -1 });

// Text search index
postSchema.index({
  title: 'text',
  content: 'text',
  tags: 'text',
  keywords: 'text'
});

// Geospatial index for location
postSchema.index({ 'location.coordinates': '2dsphere' });

// Virtual for engagement score
postSchema.virtual('engagementScore').get(function() {
  return this.stats.likes + this.stats.comments * 2 + this.stats.shares * 3;
});

// Virtual for total interactions
postSchema.virtual('totalInteractions').get(function() {
  return this.stats.likes + this.stats.dislikes + this.stats.comments + this.stats.shares + this.stats.bookmarks;
});

// Method to increment view count
postSchema.methods.incrementViews = function() {
  this.stats.views++;
  this.lastActivity = new Date();
  return this.save();
};

// Method to toggle like
postSchema.methods.toggleLike = function(userId) {
  const existingLike = this.likes.find(like => like.user.toString() === userId.toString());
  
  if (existingLike) {
    // Remove like
    this.likes = this.likes.filter(like => like.user.toString() !== userId.toString());
    this.stats.likes--;
  } else {
    // Add like
    this.likes.push({ user: userId });
    this.stats.likes++;
    
    // Remove dislike if exists
    const existingDislike = this.dislikes.find(dislike => dislike.user.toString() === userId.toString());
    if (existingDislike) {
      this.dislikes = this.dislikes.filter(dislike => dislike.user.toString() !== userId.toString());
      this.stats.dislikes--;
    }
  }
  
  this.lastActivity = new Date();
  return this.save();
};

// Method to toggle dislike
postSchema.methods.toggleDislike = function(userId) {
  const existingDislike = this.dislikes.find(dislike => dislike.user.toString() === userId.toString());
  
  if (existingDislike) {
    // Remove dislike
    this.dislikes = this.dislikes.filter(dislike => dislike.user.toString() !== userId.toString());
    this.stats.dislikes--;
  } else {
    // Add dislike
    this.dislikes.push({ user: userId });
    this.stats.dislikes++;
    
    // Remove like if exists
    const existingLike = this.likes.find(like => like.user.toString() === userId.toString());
    if (existingLike) {
      this.likes = this.likes.filter(like => like.user.toString() !== userId.toString());
      this.stats.likes--;
    }
  }
  
  this.lastActivity = new Date();
  return this.save();
};

// Method to toggle bookmark
postSchema.methods.toggleBookmark = function(userId) {
  const existingBookmark = this.bookmarks.find(bookmark => bookmark.user.toString() === userId.toString());
  
  if (existingBookmark) {
    // Remove bookmark
    this.bookmarks = this.bookmarks.filter(bookmark => bookmark.user.toString() !== userId.toString());
    this.stats.bookmarks--;
  } else {
    // Add bookmark
    this.bookmarks.push({ user: userId });
    this.stats.bookmarks++;
  }
  
  return this.save();
};

// Method to add comment
postSchema.methods.addComment = function(authorId, content, parentCommentId = null) {
  const comment = {
    author: authorId,
    content: content,
    parentComment: parentCommentId
  };
  
  this.comments.push(comment);
  this.stats.comments++;
  this.lastActivity = new Date();
  
  return this.save();
};

// Method to add report
postSchema.methods.addReport = function(reporterId, reason, description) {
  const existingReport = this.moderation.reports.find(
    report => report.reporter.toString() === reporterId.toString()
  );
  
  if (existingReport) {
    // Update existing report
    existingReport.reason = reason;
    existingReport.description = description;
    existingReport.createdAt = new Date();
  } else {
    // Add new report
    this.moderation.reports.push({
      reporter: reporterId,
      reason: reason,
      description: description
    });
  }
  
  this.moderation.reportCount = this.moderation.reports.length;
  this.moderation.reported = true;
  
  return this.save();
};

// Pre-save middleware to generate slug
postSchema.pre('save', function(next) {
  if (this.isNew || this.isModified('title')) {
    this.seo.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 50);
  }
  next();
});

// Static method to find public posts
postSchema.statics.findPublic = function(options = {}) {
  const query = {
    status: 'published',
    visibility: 'public'
  };
  
  if (options.category) query.category = options.category;
  if (options.type) query.type = options.type;
  if (options.featured) query.featured = true;
  if (options.author) query.author = options.author;
  
  return this.find(query)
    .populate('author', 'username profile.displayName profile.avatar')
    .populate('aiGenerated.aiAgent', 'name avatar')
    .sort(options.sort || { publishedAt: -1 });
};

// Static method to search posts
postSchema.statics.searchPosts = function(searchTerm, options = {}) {
  const query = {
    $text: { $search: searchTerm },
    status: 'published',
    visibility: 'public'
  };
  
  if (options.category) query.category = options.category;
  if (options.type) query.type = options.type;
  
  return this.find(query, { score: { $meta: 'textScore' } })
    .populate('author', 'username profile.displayName profile.avatar')
    .populate('aiGenerated.aiAgent', 'name avatar')
    .sort({ score: { $meta: 'textScore' } });
};

// Static method to find trending posts
postSchema.statics.findTrending = function(timeframe = 'week') {
  const now = new Date();
  let since;
  
  switch (timeframe) {
    case 'day':
      since = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      break;
    case 'week':
      since = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'month':
      since = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    default:
      since = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  }
  
  return this.find({
    status: 'published',
    visibility: 'public',
    publishedAt: { $gte: since }
  })
    .populate('author', 'username profile.displayName profile.avatar')
    .populate('aiGenerated.aiAgent', 'name avatar')
    .sort({ 'stats.likes': -1, 'stats.comments': -1, 'stats.shares': -1 });
};

module.exports = mongoose.model('Post', postSchema); 