const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  // Message Content
  content: {
    type: String,
    required: [true, 'Message content is required'],
    maxlength: [5000, 'Message content cannot exceed 5000 characters']
  },
  
  // Message Type
  type: {
    type: String,
    enum: ['text', 'image', 'file', 'system', 'ai-generated'],
    default: 'text'
  },
  
  // Sender Information
  sender: {
    type: {
      type: String,
      enum: ['user', 'ai', 'system'],
      required: true
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'messages.sender.type'
    }
  },
  
  // Media Content
  media: {
    url: String,
    type: {
      type: String,
      enum: ['image', 'video', 'audio', 'file']
    },
    filename: String,
    size: Number,
    mimeType: String,
    thumbnail: String
  },
  
  // AI Generation Details
  aiGeneration: {
    model: String,
    temperature: Number,
    maxTokens: Number,
    prompt: String,
    completionTokens: Number,
    promptTokens: Number,
    totalTokens: Number,
    cost: Number,
    processingTime: Number,
    seed: String
  },
  
  // Message Status
  status: {
    type: String,
    enum: ['sending', 'sent', 'delivered', 'read', 'failed'],
    default: 'sent'
  },
  
  // Reactions & Feedback
  reactions: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    type: {
      type: String,
      enum: ['like', 'dislike', 'love', 'laugh', 'wow', 'sad', 'angry'],
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Feedback for AI responses
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    helpful: Boolean,
    comment: String,
    reportedAt: Date,
    reportReason: String
  },
  
  // Message Threading
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation.messages'
  },
  
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
    }
  }],
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const conversationSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  
  // Participants
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Conversation must have a user']
  },
  aiAgent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AIAgent',
    required: [true, 'Conversation must have an AI agent']
  },
  
  // Conversation Type
  type: {
    type: String,
    enum: ['chat', 'creation', 'assistant', 'support', 'feedback'],
    default: 'chat'
  },
  
  // Messages
  messages: [messageSchema],
  
  // Conversation State
  status: {
    type: String,
    enum: ['active', 'paused', 'completed', 'archived', 'deleted'],
    default: 'active'
  },
  
  // Settings & Configuration
  settings: {
    // AI Configuration
    aiConfig: {
      model: String,
      temperature: {
        type: Number,
        default: 0.7
      },
      maxTokens: {
        type: Number,
        default: 1000
      },
      systemPrompt: String,
      contextWindow: {
        type: Number,
        default: 10
      }
    },
    
    // Privacy Settings
    privacy: {
      saveMessages: {
        type: Boolean,
        default: true
      },
      allowSharing: {
        type: Boolean,
        default: false
      },
      anonymizeData: {
        type: Boolean,
        default: false
      }
    },
    
    // Notification Settings
    notifications: {
      enabled: {
        type: Boolean,
        default: true
      },
      sound: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      }
    }
  },
  
  // Usage Statistics
  stats: {
    totalMessages: {
      type: Number,
      default: 0
    },
    userMessages: {
      type: Number,
      default: 0
    },
    aiMessages: {
      type: Number,
      default: 0
    },
    totalTokens: {
      type: Number,
      default: 0
    },
    totalCost: {
      type: Number,
      default: 0
    },
    averageResponseTime: {
      type: Number,
      default: 0
    },
    sessionDuration: {
      type: Number,
      default: 0
    }
  },
  
  // Categorization & Tagging
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  category: {
    type: String,
    enum: ['general', 'creative', 'work', 'learning', 'entertainment', 'support'],
    default: 'general'
  },
  
  // Sharing & Visibility
  visibility: {
    type: String,
    enum: ['private', 'shared', 'public'],
    default: 'private'
  },
  sharedWith: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    permission: {
      type: String,
      enum: ['read', 'comment', 'edit'],
      default: 'read'
    },
    sharedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Bookmarking & Favorites
  bookmarks: [{
    message: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation.messages'
    },
    note: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Context & Memory
  context: {
    summary: String,
    keyPoints: [String],
    entities: [{
      name: String,
      type: String,
      value: String
    }],
    preferences: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    history: [{
      action: String,
      timestamp: {
        type: Date,
        default: Date.now
      },
      data: mongoose.Schema.Types.Mixed
    }]
  },
  
  // Quality & Satisfaction
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    satisfaction: {
      type: String,
      enum: ['very-unsatisfied', 'unsatisfied', 'neutral', 'satisfied', 'very-satisfied']
    },
    comments: String,
    helpful: Boolean,
    wouldRecommend: Boolean,
    improveAreas: [String],
    submittedAt: Date
  },
  
  // Moderation & Safety
  moderation: {
    flagged: {
      type: Boolean,
      default: false
    },
    flags: [{
      type: {
        type: String,
        enum: ['inappropriate', 'spam', 'harassment', 'harmful', 'other']
      },
      reason: String,
      flaggedAt: {
        type: Date,
        default: Date.now
      },
      flaggedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }],
    reviewed: {
      type: Boolean,
      default: false
    },
    reviewedAt: Date,
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    moderationNotes: String
  },
  
  // Activity Tracking
  lastActivity: {
    type: Date,
    default: Date.now
  },
  lastMessageAt: {
    type: Date,
    default: Date.now
  },
  
  // Archival & Cleanup
  retention: {
    autoDelete: {
      type: Boolean,
      default: false
    },
    deleteAfterDays: {
      type: Number,
      default: 365
    },
    lastCleanup: Date
  }
  
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
conversationSchema.index({ user: 1, aiAgent: 1 });
conversationSchema.index({ user: 1, status: 1 });
conversationSchema.index({ aiAgent: 1, status: 1 });
conversationSchema.index({ type: 1, category: 1 });
conversationSchema.index({ lastActivity: -1 });
conversationSchema.index({ lastMessageAt: -1 });
conversationSchema.index({ createdAt: -1 });
conversationSchema.index({ 'stats.totalMessages': -1 });
conversationSchema.index({ tags: 1 });
conversationSchema.index({ visibility: 1 });

// Index for message search
conversationSchema.index({ 'messages.content': 'text' });

// Virtual for message count
conversationSchema.virtual('messageCount').get(function() {
  return this.messages.length;
});

// Virtual for duration
conversationSchema.virtual('duration').get(function() {
  if (this.messages.length < 2) return 0;
  
  const first = this.messages[0].createdAt;
  const last = this.messages[this.messages.length - 1].createdAt;
  return last - first;
});

// Virtual for last message
conversationSchema.virtual('lastMessage').get(function() {
  if (this.messages.length === 0) return null;
  return this.messages[this.messages.length - 1];
});

// Virtual for participant count
conversationSchema.virtual('participantCount').get(function() {
  return this.sharedWith.length + 1; // +1 for the owner
});

// Method to add message
conversationSchema.methods.addMessage = function(content, sender, options = {}) {
  const message = {
    content: content,
    sender: sender,
    type: options.type || 'text',
    media: options.media,
    aiGeneration: options.aiGeneration,
    replyTo: options.replyTo
  };
  
  this.messages.push(message);
  
  // Update stats
  this.stats.totalMessages++;
  if (sender.type === 'user') {
    this.stats.userMessages++;
  } else if (sender.type === 'ai') {
    this.stats.aiMessages++;
  }
  
  // Update timestamps
  this.lastMessageAt = new Date();
  this.lastActivity = new Date();
  
  // Update AI usage stats
  if (options.aiGeneration) {
    this.stats.totalTokens += options.aiGeneration.totalTokens || 0;
    this.stats.totalCost += options.aiGeneration.cost || 0;
  }
  
  return this.save();
};

// Method to update message
conversationSchema.methods.updateMessage = function(messageId, content, editReason) {
  const message = this.messages.id(messageId);
  if (!message) throw new Error('Message not found');
  
  // Save edit history
  message.editHistory.push({
    content: message.content,
    editedAt: new Date()
  });
  
  message.content = content;
  message.isEdited = true;
  message.updatedAt = new Date();
  
  this.lastActivity = new Date();
  
  return this.save();
};

// Method to delete message
conversationSchema.methods.deleteMessage = function(messageId) {
  this.messages.id(messageId).remove();
  this.stats.totalMessages--;
  this.lastActivity = new Date();
  
  return this.save();
};

// Method to add reaction
conversationSchema.methods.addReaction = function(messageId, userId, reactionType) {
  const message = this.messages.id(messageId);
  if (!message) throw new Error('Message not found');
  
  // Remove existing reaction from this user
  message.reactions = message.reactions.filter(
    r => r.user.toString() !== userId.toString()
  );
  
  // Add new reaction
  message.reactions.push({
    user: userId,
    type: reactionType
  });
  
  return this.save();
};

// Method to add feedback
conversationSchema.methods.addMessageFeedback = function(messageId, feedback) {
  const message = this.messages.id(messageId);
  if (!message) throw new Error('Message not found');
  
  message.feedback = {
    ...message.feedback,
    ...feedback
  };
  
  return this.save();
};

// Method to bookmark message
conversationSchema.methods.bookmarkMessage = function(messageId, note) {
  const existingBookmark = this.bookmarks.find(
    b => b.message.toString() === messageId.toString()
  );
  
  if (existingBookmark) {
    existingBookmark.note = note;
    existingBookmark.createdAt = new Date();
  } else {
    this.bookmarks.push({
      message: messageId,
      note: note
    });
  }
  
  return this.save();
};

// Method to share conversation
conversationSchema.methods.shareWith = function(userId, permission = 'read') {
  const existingShare = this.sharedWith.find(
    s => s.user.toString() === userId.toString()
  );
  
  if (existingShare) {
    existingShare.permission = permission;
    existingShare.sharedAt = new Date();
  } else {
    this.sharedWith.push({
      user: userId,
      permission: permission
    });
  }
  
  return this.save();
};

// Method to generate summary
conversationSchema.methods.generateSummary = function() {
  if (this.messages.length === 0) return '';
  
  const messageContents = this.messages
    .filter(m => m.type === 'text')
    .map(m => m.content)
    .join(' ');
  
  // Simple summary generation (in real app, use AI service)
  const summary = messageContents.substring(0, 200) + '...';
  
  this.context.summary = summary;
  return this.save();
};

// Method to archive conversation
conversationSchema.methods.archive = function() {
  this.status = 'archived';
  this.lastActivity = new Date();
  return this.save();
};

// Method to calculate response time
conversationSchema.methods.calculateAverageResponseTime = function() {
  if (this.messages.length < 2) return 0;
  
  const responseTimes = [];
  
  for (let i = 1; i < this.messages.length; i++) {
    const prev = this.messages[i - 1];
    const curr = this.messages[i];
    
    if (prev.sender.type !== curr.sender.type) {
      const timeDiff = curr.createdAt - prev.createdAt;
      responseTimes.push(timeDiff);
    }
  }
  
  if (responseTimes.length === 0) return 0;
  
  const avgResponseTime = responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;
  this.stats.averageResponseTime = avgResponseTime;
  
  return avgResponseTime;
};

// Static method to find user conversations
conversationSchema.statics.findUserConversations = function(userId, options = {}) {
  const query = {
    user: userId,
    status: { $in: ['active', 'paused', 'completed'] }
  };
  
  if (options.type) query.type = options.type;
  if (options.aiAgent) query.aiAgent = options.aiAgent;
  if (options.category) query.category = options.category;
  
  return this.find(query)
    .populate('aiAgent', 'name avatar config.systemPrompt')
    .sort(options.sort || { lastActivity: -1 });
};

// Static method to find shared conversations
conversationSchema.statics.findSharedConversations = function(userId, options = {}) {
  const query = {
    'sharedWith.user': userId,
    status: { $in: ['active', 'paused', 'completed'] }
  };
  
  return this.find(query)
    .populate('user', 'username profile.displayName profile.avatar')
    .populate('aiAgent', 'name avatar')
    .sort(options.sort || { lastActivity: -1 });
};

// Static method to search conversations
conversationSchema.statics.searchConversations = function(userId, searchTerm, options = {}) {
  const query = {
    user: userId,
    $text: { $search: searchTerm },
    status: { $in: ['active', 'paused', 'completed'] }
  };
  
  return this.find(query, { score: { $meta: 'textScore' } })
    .populate('aiAgent', 'name avatar')
    .sort({ score: { $meta: 'textScore' } });
};

// Pre-save middleware to auto-generate title
conversationSchema.pre('save', function(next) {
  if (this.isNew && !this.title && this.messages.length > 0) {
    const firstMessage = this.messages[0];
    this.title = firstMessage.content.substring(0, 50) + '...';
  }
  next();
});

// Pre-save middleware to update session duration
conversationSchema.pre('save', function(next) {
  if (this.messages.length >= 2) {
    const first = this.messages[0].createdAt;
    const last = this.messages[this.messages.length - 1].createdAt;
    this.stats.sessionDuration = last - first;
  }
  next();
});

module.exports = mongoose.model('Conversation', conversationSchema); 