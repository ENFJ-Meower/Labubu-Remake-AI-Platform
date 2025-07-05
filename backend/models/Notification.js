const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  // Recipient Information
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Notification must have a recipient']
  },
  
  // Notification Type & Content
  type: {
    type: String,
    enum: [
      'system',
      'user_follow',
      'user_mention',
      'post_like',
      'post_comment',
      'post_share',
      'ai_agent_update',
      'ai_agent_featured',
      'conversation_shared',
      'marketplace_purchase',
      'marketplace_sale',
      'marketplace_review',
      'community_event',
      'community_invitation',
      'moderation_warning',
      'moderation_action',
      'account_security',
      'feature_announcement',
      'promotional',
      'custom'
    ],
    required: [true, 'Notification type is required']
  },
  
  // Notification Content
  title: {
    type: String,
    required: [true, 'Notification title is required'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  message: {
    type: String,
    required: [true, 'Notification message is required'],
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  
  // Rich Content
  content: {
    // HTML content for rich notifications
    html: String,
    
    // Images or media
    image: String,
    icon: String,
    
    // Action buttons
    actions: [{
      label: {
        type: String,
        required: true,
        maxlength: [50, 'Action label cannot exceed 50 characters']
      },
      url: String,
      action: {
        type: String,
        enum: ['navigate', 'api_call', 'dismiss', 'custom']
      },
      style: {
        type: String,
        enum: ['primary', 'secondary', 'success', 'warning', 'danger'],
        default: 'primary'
      },
      data: mongoose.Schema.Types.Mixed
    }],
    
    // Custom data payload
    data: mongoose.Schema.Types.Mixed
  },
  
  // Source Information
  source: {
    // Who/what triggered this notification
    type: {
      type: String,
      enum: ['user', 'system', 'ai_agent', 'automated', 'external'],
      default: 'system'
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'source.type'
    },
    name: String,
    avatar: String
  },
  
  // Related Objects
  relatedObjects: [{
    type: {
      type: String,
      enum: ['User', 'Post', 'AIAgent', 'Product', 'Conversation', 'Event', 'Order', 'Review'],
      required: true
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'relatedObjects.type'
    },
    title: String,
    url: String
  }],
  
  // Notification Status
  status: {
    type: String,
    enum: ['pending', 'sent', 'delivered', 'read', 'failed', 'expired'],
    default: 'pending'
  },
  
  // Priority & Urgency
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  urgency: {
    type: String,
    enum: ['background', 'normal', 'critical'],
    default: 'normal'
  },
  
  // Delivery Channels
  channels: {
    // In-app notification
    inApp: {
      enabled: {
        type: Boolean,
        default: true
      },
      delivered: {
        type: Boolean,
        default: false
      },
      deliveredAt: Date,
      readAt: Date
    },
    
    // Email notification
    email: {
      enabled: {
        type: Boolean,
        default: false
      },
      delivered: {
        type: Boolean,
        default: false
      },
      deliveredAt: Date,
      openedAt: Date,
      clickedAt: Date,
      bounced: {
        type: Boolean,
        default: false
      },
      bounceReason: String
    },
    
    // Push notification
    push: {
      enabled: {
        type: Boolean,
        default: false
      },
      delivered: {
        type: Boolean,
        default: false
      },
      deliveredAt: Date,
      clickedAt: Date,
      failed: {
        type: Boolean,
        default: false
      },
      failureReason: String
    },
    
    // SMS notification
    sms: {
      enabled: {
        type: Boolean,
        default: false
      },
      delivered: {
        type: Boolean,
        default: false
      },
      deliveredAt: Date,
      failed: {
        type: Boolean,
        default: false
      },
      failureReason: String
    }
  },
  
  // Scheduling & Delivery
  scheduledFor: {
    type: Date,
    default: Date.now
  },
  expiresAt: Date,
  
  // Batch Information
  batch: {
    id: String,
    type: {
      type: String,
      enum: ['individual', 'group', 'broadcast', 'segmented']
    },
    totalRecipients: Number,
    currentIndex: Number
  },
  
  // Personalization
  personalization: {
    variables: mongoose.Schema.Types.Mixed,
    template: String,
    language: {
      type: String,
      default: 'en'
    },
    timezone: String
  },
  
  // Tracking & Analytics
  tracking: {
    // Delivery tracking
    deliveryAttempts: {
      type: Number,
      default: 0
    },
    lastDeliveryAttempt: Date,
    
    // Engagement tracking
    viewed: {
      type: Boolean,
      default: false
    },
    viewedAt: Date,
    clicked: {
      type: Boolean,
      default: false
    },
    clickedAt: Date,
    
    // Interaction tracking
    dismissed: {
      type: Boolean,
      default: false
    },
    dismissedAt: Date,
    actioned: {
      type: Boolean,
      default: false
    },
    actionedAt: Date,
    actionTaken: String
  },
  
  // Categorization & Filtering
  category: {
    type: String,
    enum: ['social', 'system', 'security', 'marketing', 'transactional', 'promotional'],
    default: 'system'
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  
  // User Preferences Override
  preferences: {
    canDismiss: {
      type: Boolean,
      default: true
    },
    canMarkAsRead: {
      type: Boolean,
      default: true
    },
    persistent: {
      type: Boolean,
      default: false
    },
    autoExpire: {
      type: Boolean,
      default: true
    },
    expireAfterDays: {
      type: Number,
      default: 30
    }
  },
  
  // Moderation & Safety
  moderation: {
    approved: {
      type: Boolean,
      default: true
    },
    flagged: {
      type: Boolean,
      default: false
    },
    flagReason: String,
    moderatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    moderatedAt: Date
  },
  
  // Retry & Error Handling
  retry: {
    enabled: {
      type: Boolean,
      default: true
    },
    maxAttempts: {
      type: Number,
      default: 3
    },
    currentAttempt: {
      type: Number,
      default: 0
    },
    nextRetryAt: Date,
    backoffMultiplier: {
      type: Number,
      default: 2
    },
    lastError: String
  }
  
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
notificationSchema.index({ recipient: 1, status: 1 });
notificationSchema.index({ recipient: 1, type: 1 });
notificationSchema.index({ recipient: 1, category: 1 });
notificationSchema.index({ recipient: 1, 'channels.inApp.readAt': 1 });
notificationSchema.index({ scheduledFor: 1, status: 1 });
notificationSchema.index({ expiresAt: 1 });
notificationSchema.index({ priority: 1, urgency: 1 });
notificationSchema.index({ 'batch.id': 1 });
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ tags: 1 });

// Compound indexes for common queries
notificationSchema.index({ recipient: 1, status: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, 'channels.inApp.readAt': 1, createdAt: -1 });

// Virtual for read status
notificationSchema.virtual('isRead').get(function() {
  return !!(this.channels.inApp.readAt || this.status === 'read');
});

// Virtual for delivery status
notificationSchema.virtual('isDelivered').get(function() {
  return this.channels.inApp.delivered || 
         this.channels.email.delivered || 
         this.channels.push.delivered || 
         this.channels.sms.delivered;
});

// Virtual for engagement score
notificationSchema.virtual('engagementScore').get(function() {
  let score = 0;
  
  if (this.tracking.viewed) score += 1;
  if (this.tracking.clicked) score += 2;
  if (this.tracking.actioned) score += 3;
  
  return score;
});

// Virtual for time since created
notificationSchema.virtual('timeSinceCreated').get(function() {
  return Date.now() - this.createdAt.getTime();
});

// Method to mark as read
notificationSchema.methods.markAsRead = function() {
  if (!this.channels.inApp.readAt) {
    this.channels.inApp.readAt = new Date();
    this.tracking.viewed = true;
    this.tracking.viewedAt = new Date();
    this.status = 'read';
  }
  return this.save();
};

// Method to mark as clicked
notificationSchema.methods.markAsClicked = function(actionTaken = null) {
  if (!this.tracking.clicked) {
    this.tracking.clicked = true;
    this.tracking.clickedAt = new Date();
    
    if (actionTaken) {
      this.tracking.actioned = true;
      this.tracking.actionedAt = new Date();
      this.tracking.actionTaken = actionTaken;
    }
  }
  return this.save();
};

// Method to dismiss notification
notificationSchema.methods.dismiss = function() {
  this.tracking.dismissed = true;
  this.tracking.dismissedAt = new Date();
  return this.save();
};

// Method to check if expired
notificationSchema.methods.isExpired = function() {
  if (!this.expiresAt) return false;
  return Date.now() > this.expiresAt.getTime();
};

// Method to schedule retry
notificationSchema.methods.scheduleRetry = function(error = null) {
  if (!this.retry.enabled || this.retry.currentAttempt >= this.retry.maxAttempts) {
    this.status = 'failed';
    if (error) this.retry.lastError = error;
    return this.save();
  }
  
  this.retry.currentAttempt++;
  if (error) this.retry.lastError = error;
  
  // Calculate next retry time with exponential backoff
  const delayMs = Math.pow(this.retry.backoffMultiplier, this.retry.currentAttempt) * 60000; // Base delay: 1 minute
  this.retry.nextRetryAt = new Date(Date.now() + delayMs);
  
  return this.save();
};

// Method to update delivery status
notificationSchema.methods.updateDeliveryStatus = function(channel, status, details = {}) {
  if (!this.channels[channel]) {
    throw new Error(`Invalid channel: ${channel}`);
  }
  
  this.channels[channel].delivered = status === 'delivered';
  this.channels[channel].deliveredAt = status === 'delivered' ? new Date() : null;
  
  if (status === 'failed') {
    this.channels[channel].failed = true;
    this.channels[channel].failureReason = details.reason || 'Unknown error';
  }
  
  if (details.bounced) {
    this.channels[channel].bounced = true;
    this.channels[channel].bounceReason = details.bounceReason;
  }
  
  // Update overall status
  if (this.isDelivered) {
    this.status = 'delivered';
  } else if (status === 'failed' && this.retry.currentAttempt >= this.retry.maxAttempts) {
    this.status = 'failed';
  }
  
  return this.save();
};

// Static method to find user notifications
notificationSchema.statics.findUserNotifications = function(userId, options = {}) {
  const query = {
    recipient: userId
  };
  
  if (options.type) query.type = options.type;
  if (options.category) query.category = options.category;
  if (options.unreadOnly) query['channels.inApp.readAt'] = null;
  if (options.tags) query.tags = { $in: options.tags };
  
  return this.find(query)
    .populate('source.id', 'username profile.displayName profile.avatar')
    .sort(options.sort || { createdAt: -1 })
    .limit(options.limit || 50);
};

// Static method to find unread notifications
notificationSchema.statics.findUnreadNotifications = function(userId, options = {}) {
  const query = {
    recipient: userId,
    'channels.inApp.readAt': null,
    status: { $in: ['sent', 'delivered'] }
  };
  
  if (options.type) query.type = options.type;
  if (options.category) query.category = options.category;
  if (options.priority) query.priority = options.priority;
  
  return this.find(query)
    .populate('source.id', 'username profile.displayName profile.avatar')
    .sort({ priority: 1, createdAt: -1 })
    .limit(options.limit || 20);
};

// Static method to find notifications due for delivery
notificationSchema.statics.findDueForDelivery = function() {
  return this.find({
    status: 'pending',
    scheduledFor: { $lte: new Date() },
    $or: [
      { expiresAt: null },
      { expiresAt: { $gt: new Date() } }
    ]
  }).sort({ priority: 1, scheduledFor: 1 });
};

// Static method to find notifications due for retry
notificationSchema.statics.findDueForRetry = function() {
  return this.find({
    status: 'failed',
    'retry.enabled': true,
    'retry.currentAttempt': { $lt: '$retry.maxAttempts' },
    'retry.nextRetryAt': { $lte: new Date() }
  }).sort({ priority: 1, 'retry.nextRetryAt': 1 });
};

// Static method to find expired notifications
notificationSchema.statics.findExpiredNotifications = function() {
  return this.find({
    expiresAt: { $lt: new Date() },
    status: { $in: ['pending', 'sent', 'delivered'] }
  });
};

// Static method to get notification statistics
notificationSchema.statics.getStatistics = function(userId, timeframe = 'week') {
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
  
  return this.aggregate([
    {
      $match: {
        recipient: userId,
        createdAt: { $gte: since }
      }
    },
    {
      $group: {
        _id: null,
        totalNotifications: { $sum: 1 },
        readNotifications: {
          $sum: {
            $cond: [{ $ne: ['$channels.inApp.readAt', null] }, 1, 0]
          }
        },
        clickedNotifications: {
          $sum: {
            $cond: ['$tracking.clicked', 1, 0]
          }
        },
        dismissedNotifications: {
          $sum: {
            $cond: ['$tracking.dismissed', 1, 0]
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        totalNotifications: 1,
        readNotifications: 1,
        unreadNotifications: { $subtract: ['$totalNotifications', '$readNotifications'] },
        clickedNotifications: 1,
        dismissedNotifications: 1,
        readRate: {
          $cond: [
            { $gt: ['$totalNotifications', 0] },
            { $divide: ['$readNotifications', '$totalNotifications'] },
            0
          ]
        },
        clickRate: {
          $cond: [
            { $gt: ['$totalNotifications', 0] },
            { $divide: ['$clickedNotifications', '$totalNotifications'] },
            0
          ]
        }
      }
    }
  ]);
};

// Pre-save middleware to set expiration
notificationSchema.pre('save', function(next) {
  if (this.isNew && this.preferences.autoExpire && !this.expiresAt) {
    const expireDays = this.preferences.expireAfterDays || 30;
    this.expiresAt = new Date(Date.now() + expireDays * 24 * 60 * 60 * 1000);
  }
  next();
});

// Pre-save middleware to update delivery attempts
notificationSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'sent') {
    this.tracking.deliveryAttempts++;
    this.tracking.lastDeliveryAttempt = new Date();
  }
  next();
});

module.exports = mongoose.model('Notification', notificationSchema); 