const mongoose = require('mongoose');

const aiAgentSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Please provide an agent name'],
    trim: true,
    maxlength: [100, 'Agent name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide an agent description'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  
  // Creator Information
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Agent must have a creator']
  },
  
  // Agent Type & Category
  type: {
    type: String,
    enum: ['creative', 'assistant', 'educational', 'entertainment', 'utility', 'custom'],
    required: [true, 'Please specify agent type']
  },
  category: {
    type: String,
    enum: ['art', 'writing', 'music', 'coding', 'design', 'chat', 'game', 'business', 'education', 'other'],
    required: [true, 'Please specify agent category']
  },
  
  // Agent Configuration
  config: {
    // AI Model Settings
    model: {
      type: String,
      enum: ['gpt-3.5-turbo', 'gpt-4', 'claude-3', 'custom'],
      default: 'gpt-3.5-turbo'
    },
    temperature: {
      type: Number,
      min: 0,
      max: 2,
      default: 0.7
    },
    maxTokens: {
      type: Number,
      min: 10,
      max: 4000,
      default: 1000
    },
    topP: {
      type: Number,
      min: 0,
      max: 1,
      default: 1
    },
    presencePenalty: {
      type: Number,
      min: -2,
      max: 2,
      default: 0
    },
    frequencyPenalty: {
      type: Number,
      min: -2,
      max: 2,
      default: 0
    },
    
    // System Prompt
    systemPrompt: {
      type: String,
      required: [true, 'System prompt is required'],
      maxlength: [2000, 'System prompt cannot exceed 2000 characters']
    },
    
    // Capabilities
    capabilities: {
      textGeneration: {
        type: Boolean,
        default: true
      },
      imageGeneration: {
        type: Boolean,
        default: false
      },
      imageAnalysis: {
        type: Boolean,
        default: false
      },
      codeGeneration: {
        type: Boolean,
        default: false
      },
      webSearch: {
        type: Boolean,
        default: false
      },
      fileProcessing: {
        type: Boolean,
        default: false
      }
    },
    
    // Response Settings
    responseStyle: {
      type: String,
      enum: ['professional', 'casual', 'creative', 'technical', 'friendly'],
      default: 'friendly'
    },
    language: {
      type: String,
      default: 'en'
    },
    
    // Safety Settings
    contentFilter: {
      type: Boolean,
      default: true
    },
    safetyLevel: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    }
  },
  
  // Visual & Branding
  avatar: {
    type: String,
    default: null
  },
  banner: {
    type: String,
    default: null
  },
  theme: {
    primaryColor: {
      type: String,
      default: '#ff6b6b'
    },
    secondaryColor: {
      type: String,
      default: '#4ecdc4'
    },
    backgroundColor: {
      type: String,
      default: '#ffffff'
    }
  },
  
  // Status & Visibility
  status: {
    type: String,
    enum: ['draft', 'published', 'private', 'archived'],
    default: 'draft'
  },
  visibility: {
    type: String,
    enum: ['public', 'unlisted', 'private'],
    default: 'public'
  },
  
  // Usage & Statistics
  stats: {
    totalConversations: {
      type: Number,
      default: 0
    },
    totalMessages: {
      type: Number,
      default: 0
    },
    totalUsers: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    totalRatings: {
      type: Number,
      default: 0
    },
    totalLikes: {
      type: Number,
      default: 0
    },
    totalShares: {
      type: Number,
      default: 0
    },
    totalClones: {
      type: Number,
      default: 0
    }
  },
  
  // Interaction History
  conversations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation'
  }],
  
  // Ratings & Reviews
  ratings: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    review: {
      type: String,
      maxlength: [500, 'Review cannot exceed 500 characters']
    },
    createdAt: {
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
  
  // Pricing (for marketplace)
  pricing: {
    type: {
      type: String,
      enum: ['free', 'premium', 'usage-based', 'subscription'],
      default: 'free'
    },
    price: {
      type: Number,
      default: 0,
      min: 0
    },
    currency: {
      type: String,
      default: 'USD'
    },
    billingCycle: {
      type: String,
      enum: ['one-time', 'monthly', 'yearly', 'per-use'],
      default: 'one-time'
    }
  },
  
  // Version Control
  version: {
    type: String,
    default: '1.0.0'
  },
  changelog: [{
    version: String,
    changes: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Permissions & Access
  permissions: {
    canClone: {
      type: Boolean,
      default: true
    },
    canModify: {
      type: Boolean,
      default: false
    },
    canCommercialUse: {
      type: Boolean,
      default: false
    },
    requiresAttribution: {
      type: Boolean,
      default: true
    }
  },
  
  // Featured Status
  featured: {
    type: Boolean,
    default: false
  },
  featuredAt: Date,
  
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
    moderationNotes: String,
    lastModerated: Date,
    moderatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  
  // Activity Tracking
  lastUsed: {
    type: Date,
    default: Date.now
  },
  lastModified: {
    type: Date,
    default: Date.now
  }
  
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
aiAgentSchema.index({ creator: 1 });
aiAgentSchema.index({ type: 1, category: 1 });
aiAgentSchema.index({ status: 1, visibility: 1 });
aiAgentSchema.index({ 'stats.averageRating': -1 });
aiAgentSchema.index({ 'stats.totalUsers': -1 });
aiAgentSchema.index({ featured: 1, featuredAt: -1 });
aiAgentSchema.index({ tags: 1 });
aiAgentSchema.index({ keywords: 1 });
aiAgentSchema.index({ createdAt: -1 });
aiAgentSchema.index({ lastUsed: -1 });

// Text search index
aiAgentSchema.index({
  name: 'text',
  description: 'text',
  tags: 'text',
  keywords: 'text'
});

// Virtual for display name
aiAgentSchema.virtual('displayName').get(function() {
  return this.name || 'Unnamed Agent';
});

// Virtual for usage metrics
aiAgentSchema.virtual('usageMetrics').get(function() {
  return {
    conversations: this.stats.totalConversations,
    messages: this.stats.totalMessages,
    users: this.stats.totalUsers,
    rating: this.stats.averageRating,
    engagement: this.stats.totalLikes + this.stats.totalShares
  };
});

// Method to calculate average rating
aiAgentSchema.methods.calculateAverageRating = function() {
  if (this.ratings.length === 0) return 0;
  
  const total = this.ratings.reduce((sum, rating) => sum + rating.rating, 0);
  return Math.round((total / this.ratings.length) * 10) / 10;
};

// Method to add rating
aiAgentSchema.methods.addRating = function(userId, rating, review) {
  // Check if user already rated this agent
  const existingRating = this.ratings.find(r => r.user.toString() === userId.toString());
  
  if (existingRating) {
    existingRating.rating = rating;
    existingRating.review = review;
    existingRating.createdAt = new Date();
  } else {
    this.ratings.push({
      user: userId,
      rating: rating,
      review: review
    });
  }
  
  // Update stats
  this.stats.averageRating = this.calculateAverageRating();
  this.stats.totalRatings = this.ratings.length;
  
  return this.save();
};

// Method to increment usage stats
aiAgentSchema.methods.incrementUsage = function(type) {
  switch (type) {
    case 'conversation':
      this.stats.totalConversations++;
      break;
    case 'message':
      this.stats.totalMessages++;
      break;
    case 'user':
      this.stats.totalUsers++;
      break;
    case 'like':
      this.stats.totalLikes++;
      break;
    case 'share':
      this.stats.totalShares++;
      break;
    case 'clone':
      this.stats.totalClones++;
      break;
  }
  
  this.lastUsed = new Date();
  return this.save();
};

// Pre-save middleware to update lastModified
aiAgentSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.lastModified = new Date();
  }
  next();
});

// Static method to find public agents
aiAgentSchema.statics.findPublic = function(options = {}) {
  const query = {
    status: 'published',
    visibility: 'public'
  };
  
  if (options.category) query.category = options.category;
  if (options.type) query.type = options.type;
  if (options.featured) query.featured = true;
  
  return this.find(query)
    .populate('creator', 'username profile.displayName profile.avatar')
    .sort(options.sort || { 'stats.averageRating': -1, 'stats.totalUsers': -1 });
};

// Static method to search agents
aiAgentSchema.statics.searchAgents = function(searchTerm, options = {}) {
  const query = {
    $text: { $search: searchTerm },
    status: 'published',
    visibility: 'public'
  };
  
  if (options.category) query.category = options.category;
  if (options.type) query.type = options.type;
  
  return this.find(query, { score: { $meta: 'textScore' } })
    .populate('creator', 'username profile.displayName profile.avatar')
    .sort({ score: { $meta: 'textScore' } });
};

module.exports = mongoose.model('AIAgent', aiAgentSchema); 