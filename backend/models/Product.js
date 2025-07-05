const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Please provide a product name'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a product description'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [500, 'Short description cannot exceed 500 characters']
  },
  
  // Seller Information
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Product must have a seller']
  },
  
  // Product Type & Category
  type: {
    type: String,
    enum: ['digital', 'physical', 'service', 'ai-agent', 'template', 'course', 'asset'],
    required: [true, 'Please specify product type']
  },
  category: {
    type: String,
    enum: ['art', 'design', 'music', 'writing', 'coding', 'ai-agents', 'templates', 'courses', 'assets', 'merchandise', 'other'],
    required: [true, 'Please specify product category']
  },
  subcategory: {
    type: String,
    trim: true,
    maxlength: [100, 'Subcategory cannot exceed 100 characters']
  },
  
  // Pricing & Economics
  pricing: {
    type: {
      type: String,
      enum: ['free', 'paid', 'pay-what-you-want', 'subscription', 'auction'],
      required: [true, 'Please specify pricing type']
    },
    price: {
      type: Number,
      required: function() {
        return this.pricing.type !== 'free';
      },
      min: [0, 'Price cannot be negative']
    },
    originalPrice: {
      type: Number,
      min: [0, 'Original price cannot be negative']
    },
    currency: {
      type: String,
      default: 'USD',
      enum: ['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'KRW']
    },
    discount: {
      type: {
        type: String,
        enum: ['percentage', 'fixed'],
        default: 'percentage'
      },
      value: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
      },
      startDate: Date,
      endDate: Date,
      isActive: {
        type: Boolean,
        default: false
      }
    },
    subscription: {
      billingCycle: {
        type: String,
        enum: ['monthly', 'yearly', 'weekly'],
        default: 'monthly'
      },
      trialPeriod: {
        type: Number,
        default: 0
      },
      setupFee: {
        type: Number,
        default: 0
      }
    }
  },
  
  // Product Media
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: String,
    caption: String,
    isPrimary: {
      type: Boolean,
      default: false
    },
    order: {
      type: Number,
      default: 0
    }
  }],
  videos: [{
    url: {
      type: String,
      required: true
    },
    title: String,
    description: String,
    thumbnail: String,
    duration: Number,
    isPreview: {
      type: Boolean,
      default: false
    }
  }],
  
  // Digital Product Details
  digitalContent: {
    files: [{
      filename: String,
      url: String,
      size: Number,
      format: String,
      description: String
    }],
    downloadLimit: {
      type: Number,
      default: -1 // -1 = unlimited
    },
    previewFiles: [{
      filename: String,
      url: String,
      size: Number,
      format: String
    }]
  },
  
  // Physical Product Details
  physicalDetails: {
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
      unit: {
        type: String,
        enum: ['cm', 'in', 'mm'],
        default: 'cm'
      }
    },
    material: String,
    color: String,
    size: String,
    condition: {
      type: String,
      enum: ['new', 'like-new', 'good', 'fair', 'poor'],
      default: 'new'
    }
  },
  
  // Shipping & Logistics
  shipping: {
    required: {
      type: Boolean,
      default: false
    },
    cost: {
      type: Number,
      default: 0
    },
    freeShippingThreshold: Number,
    methods: [{
      name: String,
      cost: Number,
      estimatedDays: String,
      description: String
    }],
    restrictions: [{
      type: String,
      enum: ['domestic', 'international', 'specific-countries'],
      countries: [String]
    }],
    processingTime: {
      min: Number,
      max: Number,
      unit: {
        type: String,
        enum: ['days', 'hours', 'weeks'],
        default: 'days'
      }
    }
  },
  
  // Inventory Management
  inventory: {
    tracked: {
      type: Boolean,
      default: true
    },
    quantity: {
      type: Number,
      default: 0
    },
    reserved: {
      type: Number,
      default: 0
    },
    lowStockThreshold: {
      type: Number,
      default: 5
    },
    allowBackorders: {
      type: Boolean,
      default: false
    },
    sku: {
      type: String,
      unique: true,
      sparse: true
    }
  },
  
  // Status & Availability
  status: {
    type: String,
    enum: ['draft', 'published', 'paused', 'archived', 'deleted', 'sold'],
    default: 'draft'
  },
  availability: {
    type: String,
    enum: ['in-stock', 'out-of-stock', 'pre-order', 'discontinued'],
    default: 'in-stock'
  },
  
  // Statistics & Analytics
  stats: {
    views: {
      type: Number,
      default: 0
    },
    likes: {
      type: Number,
      default: 0
    },
    purchases: {
      type: Number,
      default: 0
    },
    revenue: {
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
    conversionRate: {
      type: Number,
      default: 0
    },
    wishlistCount: {
      type: Number,
      default: 0
    }
  },
  
  // Reviews & Ratings
  reviews: [{
    buyer: {
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
    title: {
      type: String,
      maxlength: [200, 'Review title cannot exceed 200 characters']
    },
    content: {
      type: String,
      required: true,
      maxlength: [1000, 'Review content cannot exceed 1000 characters']
    },
    verified: {
      type: Boolean,
      default: false
    },
    helpful: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    response: {
      content: String,
      respondedAt: Date
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
  
  // Related Products
  relatedProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  
  // Licensing & Usage Rights
  license: {
    type: {
      type: String,
      enum: ['standard', 'extended', 'exclusive', 'royalty-free', 'creative-commons', 'custom'],
      default: 'standard'
    },
    terms: String,
    commercialUse: {
      type: Boolean,
      default: false
    },
    modification: {
      type: Boolean,
      default: false
    },
    distribution: {
      type: Boolean,
      default: false
    },
    attribution: {
      type: Boolean,
      default: true
    },
    customTerms: String
  },
  
  // AI Agent Integration
  aiAgent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AIAgent'
  },
  
  // SEO & Marketing
  seo: {
    metaTitle: String,
    metaDescription: String,
    slug: {
      type: String,
      unique: true,
      sparse: true
    },
    canonicalUrl: String,
    keywords: [String]
  },
  
  // Promotional Features
  featured: {
    type: Boolean,
    default: false
  },
  featuredAt: Date,
  promotions: [{
    type: {
      type: String,
      enum: ['featured', 'trending', 'new-arrival', 'bestseller', 'staff-pick'],
      required: true
    },
    startDate: Date,
    endDate: Date,
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  
  // Moderation & Compliance
  moderation: {
    approved: {
      type: Boolean,
      default: false
    },
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
  publishedAt: Date,
  lastModified: {
    type: Date,
    default: Date.now
  },
  lastSold: Date
  
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
productSchema.index({ seller: 1 });
productSchema.index({ type: 1, category: 1 });
productSchema.index({ status: 1, availability: 1 });
productSchema.index({ 'pricing.price': 1 });
productSchema.index({ 'stats.averageRating': -1 });
productSchema.index({ 'stats.purchases': -1 });
productSchema.index({ featured: 1, featuredAt: -1 });
productSchema.index({ tags: 1 });
productSchema.index({ keywords: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ publishedAt: -1 });

// Text search index
productSchema.index({
  name: 'text',
  description: 'text',
  shortDescription: 'text',
  tags: 'text',
  keywords: 'text'
});

// Compound indexes for common queries
productSchema.index({ category: 1, 'pricing.price': 1 });
productSchema.index({ type: 1, 'stats.averageRating': -1 });
productSchema.index({ seller: 1, status: 1 });

// Virtual for display price
productSchema.virtual('displayPrice').get(function() {
  if (this.pricing.type === 'free') {
    return 'Free';
  }
  
  let price = this.pricing.price;
  
  // Apply discount if active
  if (this.pricing.discount.isActive) {
    const now = new Date();
    const discountStart = this.pricing.discount.startDate;
    const discountEnd = this.pricing.discount.endDate;
    
    if ((!discountStart || now >= discountStart) && 
        (!discountEnd || now <= discountEnd)) {
      if (this.pricing.discount.type === 'percentage') {
        price = price * (1 - this.pricing.discount.value / 100);
      } else {
        price = Math.max(0, price - this.pricing.discount.value);
      }
    }
  }
  
  return `${this.pricing.currency} ${price.toFixed(2)}`;
});

// Virtual for availability status
productSchema.virtual('isAvailable').get(function() {
  if (this.status !== 'published') return false;
  if (this.availability === 'out-of-stock') return false;
  if (this.inventory.tracked && this.inventory.quantity <= 0) return false;
  return true;
});

// Virtual for stock level
productSchema.virtual('stockLevel').get(function() {
  if (!this.inventory.tracked) return 'unlimited';
  
  const available = this.inventory.quantity - this.inventory.reserved;
  
  if (available <= 0) return 'out-of-stock';
  if (available <= this.inventory.lowStockThreshold) return 'low-stock';
  return 'in-stock';
});

// Method to calculate average rating
productSchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) return 0;
  
  const total = this.reviews.reduce((sum, review) => sum + review.rating, 0);
  return Math.round((total / this.reviews.length) * 10) / 10;
};

// Method to add review
productSchema.methods.addReview = function(buyerId, rating, title, content, verified = false) {
  // Check if user already reviewed this product
  const existingReview = this.reviews.find(r => r.buyer.toString() === buyerId.toString());
  
  if (existingReview) {
    existingReview.rating = rating;
    existingReview.title = title;
    existingReview.content = content;
    existingReview.verified = verified;
    existingReview.createdAt = new Date();
  } else {
    this.reviews.push({
      buyer: buyerId,
      rating: rating,
      title: title,
      content: content,
      verified: verified
    });
  }
  
  // Update stats
  this.stats.averageRating = this.calculateAverageRating();
  this.stats.totalRatings = this.reviews.length;
  
  return this.save();
};

// Method to increment stats
productSchema.methods.incrementStat = function(statType, value = 1) {
  if (this.stats.hasOwnProperty(statType)) {
    this.stats[statType] += value;
    return this.save();
  }
  throw new Error(`Invalid stat type: ${statType}`);
};

// Method to update inventory
productSchema.methods.updateInventory = function(quantity, operation = 'set') {
  if (!this.inventory.tracked) return this;
  
  switch (operation) {
    case 'set':
      this.inventory.quantity = quantity;
      break;
    case 'add':
      this.inventory.quantity += quantity;
      break;
    case 'subtract':
      this.inventory.quantity = Math.max(0, this.inventory.quantity - quantity);
      break;
    case 'reserve':
      this.inventory.reserved += quantity;
      break;
    case 'unreserve':
      this.inventory.reserved = Math.max(0, this.inventory.reserved - quantity);
      break;
  }
  
  // Update availability based on stock
  if (this.inventory.quantity <= 0) {
    this.availability = 'out-of-stock';
  } else if (this.availability === 'out-of-stock') {
    this.availability = 'in-stock';
  }
  
  return this.save();
};

// Method to check if product can be purchased
productSchema.methods.canPurchase = function(quantity = 1) {
  if (this.status !== 'published') return false;
  if (this.availability === 'discontinued') return false;
  
  if (this.inventory.tracked) {
    const available = this.inventory.quantity - this.inventory.reserved;
    if (available < quantity) {
      return this.inventory.allowBackorders;
    }
  }
  
  return true;
};

// Pre-save middleware to generate slug
productSchema.pre('save', function(next) {
  if (this.isNew || this.isModified('name')) {
    this.seo.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 50);
  }
  
  // Auto-generate SKU if not provided
  if (this.isNew && !this.inventory.sku) {
    this.inventory.sku = `${this.category.toUpperCase()}-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  }
  
  next();
});

// Static method to find public products
productSchema.statics.findPublic = function(options = {}) {
  const query = {
    status: 'published',
    'moderation.approved': true
  };
  
  if (options.category) query.category = options.category;
  if (options.type) query.type = options.type;
  if (options.seller) query.seller = options.seller;
  if (options.featured) query.featured = true;
  if (options.availability) query.availability = options.availability;
  
  // Price range filter
  if (options.minPrice || options.maxPrice) {
    query['pricing.price'] = {};
    if (options.minPrice) query['pricing.price'].$gte = options.minPrice;
    if (options.maxPrice) query['pricing.price'].$lte = options.maxPrice;
  }
  
  return this.find(query)
    .populate('seller', 'username profile.displayName profile.avatar')
    .populate('aiAgent', 'name avatar')
    .sort(options.sort || { 'stats.averageRating': -1, 'stats.purchases': -1 });
};

// Static method to search products
productSchema.statics.searchProducts = function(searchTerm, options = {}) {
  const query = {
    $text: { $search: searchTerm },
    status: 'published',
    'moderation.approved': true
  };
  
  if (options.category) query.category = options.category;
  if (options.type) query.type = options.type;
  
  return this.find(query, { score: { $meta: 'textScore' } })
    .populate('seller', 'username profile.displayName profile.avatar')
    .populate('aiAgent', 'name avatar')
    .sort({ score: { $meta: 'textScore' } });
};

// Static method to find trending products
productSchema.statics.findTrending = function(timeframe = 'week') {
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
    'moderation.approved': true,
    publishedAt: { $gte: since }
  })
    .populate('seller', 'username profile.displayName profile.avatar')
    .populate('aiAgent', 'name avatar')
    .sort({ 'stats.purchases': -1, 'stats.views': -1, 'stats.likes': -1 });
};

module.exports = mongoose.model('Product', productSchema); 