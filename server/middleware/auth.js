import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { errorResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Protect routes - Verify JWT token and attach user to request
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if token exists
  if (!token) {
    return errorResponse(res, 'Not authorized, no token provided', 401);
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return errorResponse(res, 'User not found', 401);
    }

    if (!user.isActive) {
      return errorResponse(res, 'User account is deactivated', 401);
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return errorResponse(res, 'Invalid token', 401);
    }
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 'Token expired', 401);
    }
    return errorResponse(res, 'Not authorized', 401);
  }
});

/**
 * Optional auth - Attach user if token exists, but don't require it
 */
export const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      if (user && user.isActive) {
        req.user = user;
      }
    } catch (error) {
      // Silently fail - optional auth
    }
  }

  next();
});

/**
 * Admin only middleware
 */
export const adminOnly = asyncHandler(async (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return errorResponse(res, 'Not authorized, admin access required', 403);
  }
  next();
});

/**
 * Check if user owns resource or is admin
 */
export const authorizeOwnerOrAdmin = (getResourceUserId) => {
  return asyncHandler(async (req, res, next) => {
    const resourceUserId = await getResourceUserId(req);
    
    if (
      req.user.role !== 'admin' && 
      req.user._id.toString() !== resourceUserId.toString()
    ) {
      return errorResponse(res, 'Not authorized to access this resource', 403);
    }
    
    next();
  });
};

export default { protect, optionalAuth, adminOnly, authorizeOwnerOrAdmin };
