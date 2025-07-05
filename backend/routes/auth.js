const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');

const User = require('../models/User');
const { 
  authenticate, 
  validateRefreshToken,
  optionalAuth 
} = require('../middleware/auth');
const { 
  asyncHandler, 
  handleValidationErrors,
  ApiError 
} = require('../middleware/errorHandler');

const router = express.Router();

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false
});

const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 password reset requests per hour
  message: {
    success: false,
    message: 'Too many password reset attempts, please try again later'
  }
});

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', 
  authLimiter,
  [
    body('username')
      .isLength({ min: 3, max: 30 })
      .withMessage('Username must be between 3 and 30 characters')
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage('Username can only contain letters, numbers, and underscores'),
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    body('confirmPassword')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Password confirmation does not match password');
        }
        return true;
      })
  ],
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { username, email, password, profile } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw new ApiError('User with this email already exists', 400);
      }
      if (existingUser.username === username) {
        throw new ApiError('Username is already taken', 400);
      }
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      profile: {
        displayName: profile?.displayName || username,
        firstName: profile?.firstName,
        lastName: profile?.lastName,
        bio: profile?.bio
      }
    });

    // Generate tokens
    const token = user.getSignedJwtToken();
    const refreshToken = user.getRefreshToken();

    // Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    user.emailVerificationToken = emailVerificationToken;
    user.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    await user.save();

    // TODO: Send verification email
    console.log(`Email verification token for ${email}: ${emailVerificationToken}`);

    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please check your email for verification.',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          profile: user.profile,
          role: user.role,
          emailVerified: user.emailVerified,
          createdAt: user.createdAt
        },
        token,
        refreshToken
      }
    });
  })
);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and get token
 * @access  Public
 */
router.post('/login',
  authLimiter,
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ],
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    try {
      // Find user by credentials
      const user = await User.findByCredentials(email, password);

      // Generate tokens
      const token = user.getSignedJwtToken();
      const refreshToken = user.getRefreshToken();

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            profile: user.profile,
            role: user.role,
            emailVerified: user.emailVerified,
            lastLogin: user.lastLogin
          },
          token,
          refreshToken
        }
      });

    } catch (error) {
      throw new ApiError(error.message, 401);
    }
  })
);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
router.post('/refresh',
  validateRefreshToken,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.refreshTokenData.id);

    if (!user || user.status !== 'active') {
      throw new ApiError('Invalid refresh token', 401);
    }

    // Generate new tokens
    const token = user.getSignedJwtToken();
    const refreshToken = user.getRefreshToken();

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        token,
        refreshToken
      }
    });
  })
);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout',
  authenticate,
  asyncHandler(async (req, res) => {
    // In a production environment, you would typically:
    // 1. Add the token to a blacklist
    // 2. Store blacklisted tokens in Redis or database
    // 3. Check blacklist in authentication middleware

    res.json({
      success: true,
      message: 'Logout successful'
    });
  })
);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me',
  authenticate,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
      .populate('following', 'username profile.displayName profile.avatar')
      .populate('followers', 'username profile.displayName profile.avatar');

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          profile: user.profile,
          role: user.role,
          status: user.status,
          emailVerified: user.emailVerified,
          stats: user.stats,
          following: user.following,
          followers: user.followers,
          preferences: user.preferences,
          privacy: user.privacy,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin,
          lastActivity: user.lastActivity
        }
      }
    });
  })
);

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile',
  authenticate,
  [
    body('profile.firstName')
      .optional()
      .isLength({ max: 50 })
      .withMessage('First name cannot exceed 50 characters'),
    body('profile.lastName')
      .optional()
      .isLength({ max: 50 })
      .withMessage('Last name cannot exceed 50 characters'),
    body('profile.displayName')
      .optional()
      .isLength({ min: 1, max: 100 })
      .withMessage('Display name must be between 1 and 100 characters'),
    body('profile.bio')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Bio cannot exceed 500 characters'),
    body('profile.location')
      .optional()
      .isLength({ max: 100 })
      .withMessage('Location cannot exceed 100 characters'),
    body('profile.website')
      .optional()
      .isURL()
      .withMessage('Please provide a valid website URL')
  ],
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { profile, preferences, privacy } = req.body;

    const updateData = {};
    if (profile) updateData.profile = { ...req.user.profile, ...profile };
    if (preferences) updateData.preferences = { ...req.user.preferences, ...preferences };
    if (privacy) updateData.privacy = { ...req.user.privacy, ...privacy };

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          profile: user.profile,
          preferences: user.preferences,
          privacy: user.privacy
        }
      }
    });
  })
);

/**
 * @route   POST /api/auth/change-password
 * @desc    Change user password
 * @access  Private
 */
router.post('/change-password',
  authenticate,
  [
    body('currentPassword')
      .notEmpty()
      .withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 6 })
      .withMessage('New password must be at least 6 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number'),
    body('confirmNewPassword')
      .custom((value, { req }) => {
        if (value !== req.body.newPassword) {
          throw new Error('Password confirmation does not match new password');
        }
        return true;
      })
  ],
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await User.findById(req.user._id).select('+password');

    // Check current password
    const isCurrentPasswordCorrect = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordCorrect) {
      throw new ApiError('Current password is incorrect', 400);
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  })
);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Send password reset email
 * @access  Public
 */
router.post('/forgot-password',
  passwordResetLimiter,
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email')
  ],
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal that the user doesn't exist
      return res.json({
        success: true,
        message: 'If a user with that email exists, a password reset link has been sent'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = resetToken;
    user.passwordResetExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // TODO: Send password reset email
    console.log(`Password reset token for ${email}: ${resetToken}`);

    res.json({
      success: true,
      message: 'If a user with that email exists, a password reset link has been sent'
    });
  })
);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password with token
 * @access  Public
 */
router.post('/reset-password',
  [
    body('token')
      .notEmpty()
      .withMessage('Reset token is required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    body('confirmPassword')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Password confirmation does not match password');
        }
        return true;
      })
  ],
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { token, password } = req.body;

    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpire: { $gt: Date.now() }
    });

    if (!user) {
      throw new ApiError('Invalid or expired reset token', 400);
    }

    // Reset password
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpire = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  })
);

/**
 * @route   POST /api/auth/verify-email
 * @desc    Verify email address
 * @access  Public
 */
router.post('/verify-email',
  [
    body('token')
      .notEmpty()
      .withMessage('Verification token is required')
  ],
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { token } = req.body;

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpire: { $gt: Date.now() }
    });

    if (!user) {
      throw new ApiError('Invalid or expired verification token', 400);
    }

    // Verify email
    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Email verified successfully'
    });
  })
);

/**
 * @route   POST /api/auth/resend-verification
 * @desc    Resend email verification
 * @access  Private
 */
router.post('/resend-verification',
  authenticate,
  asyncHandler(async (req, res) => {
    if (req.user.emailVerified) {
      throw new ApiError('Email is already verified', 400);
    }

    // Generate new verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    req.user.emailVerificationToken = emailVerificationToken;
    req.user.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    await req.user.save();

    // TODO: Send verification email
    console.log(`Email verification token for ${req.user.email}: ${emailVerificationToken}`);

    res.json({
      success: true,
      message: 'Verification email sent successfully'
    });
  })
);

/**
 * @route   GET /api/auth/check-username/:username
 * @desc    Check if username is available
 * @access  Public
 */
router.get('/check-username/:username',
  asyncHandler(async (req, res) => {
    const { username } = req.params;

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      throw new ApiError('Username can only contain letters, numbers, and underscores', 400);
    }

    if (username.length < 3 || username.length > 30) {
      throw new ApiError('Username must be between 3 and 30 characters', 400);
    }

    const existingUser = await User.findOne({ username });

    res.json({
      success: true,
      data: {
        available: !existingUser
      }
    });
  })
);

/**
 * @route   GET /api/auth/check-email/:email
 * @desc    Check if email is available
 * @access  Public
 */
router.get('/check-email/:email',
  asyncHandler(async (req, res) => {
    const { email } = req.params;

    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      throw new ApiError('Please provide a valid email', 400);
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    res.json({
      success: true,
      data: {
        available: !existingUser
      }
    });
  })
);

module.exports = router; 