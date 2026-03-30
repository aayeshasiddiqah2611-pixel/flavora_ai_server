import User from '../models/User.js';
import Recipe from '../models/Recipe.js';
import { generateToken } from '../utils/generateToken.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getPagination, buildPaginationMeta } from '../utils/pagination.js';

/**
 * @desc    Register a new user
 * @route   POST /api/users/register
 * @access  Public
 */
export const registerUser = asyncHandler(async (req, res) => {
  const { name, username, email, password, bio, avatar } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({
    $or: [{ email }, { username: username.toLowerCase() }]
  });

  if (userExists) {
    if (userExists.email === email) {
      return errorResponse(res, 'Email already registered', 400);
    }
    return errorResponse(res, 'Username already taken', 400);
  }

  // Create new user
  const user = await User.create({
    name,
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    password,
    bio: bio || '',
    avatar: avatar || null
  });

  if (user) {
    const token = generateToken(user._id);
    
    return successResponse(
      res,
      'User registered successfully',
      {
        user: user.getPublicProfile(),
        token
      },
      201
    );
  }

  return errorResponse(res, 'Invalid user data', 400);
});

/**
 * @desc    Login user
 * @route   POST /api/users/login
 * @access  Public
 */
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user by email and include password for comparison
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (!user) {
    return errorResponse(res, 'Invalid email or password', 401);
  }

  if (!user.isActive) {
    return errorResponse(res, 'Account has been deactivated', 401);
  }

  // Check password
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return errorResponse(res, 'Invalid email or password', 401);
  }

  const token = generateToken(user._id);

  return successResponse(res, 'Login successful', {
    user: user.getPublicProfile(),
    token
  });
});

/**
 * @desc    Get current user profile
 * @route   GET /api/users/me
 * @access  Private
 */
export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate('savedRecipes', 'title image cuisine prepTime likes')
    .populate('likedRecipes', 'title image cuisine prepTime likes');

  return successResponse(res, 'User profile retrieved', user.getPublicProfile());
});

/**
 * @desc    Update user profile
 * @route   PUT /api/users/me
 * @access  Private
 */
export const updateUserProfile = asyncHandler(async (req, res) => {
  const { name, bio, avatar } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, bio, avatar },
    { new: true, runValidators: true }
  );

  return successResponse(res, 'Profile updated successfully', user.getPublicProfile());
});

/**
 * @desc    Change password
 * @route   PUT /api/users/me/password
 * @access  Private
 */
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');

  // Verify current password
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    return errorResponse(res, 'Current password is incorrect', 400);
  }

  // Update password
  user.password = newPassword;
  await user.save();

  return successResponse(res, 'Password changed successfully');
});

/**
 * @desc    Get user by username
 * @route   GET /api/users/:username
 * @access  Public
 */
export const getUserByUsername = asyncHandler(async (req, res) => {
  const { username } = req.params;

  const user = await User.findOne({ username: username.toLowerCase() })
    .populate('followers', 'name username avatar')
    .populate('following', 'name username avatar');

  if (!user) {
    return errorResponse(res, 'User not found', 404);
  }

  // Get user's recipes
  const recipes = await Recipe.find({ user: user._id, isPublished: true })
    .sort({ createdAt: -1 })
    .populate('user', 'name username avatar');

  const profile = {
    ...user.getPublicProfile(),
    recipes: recipes.map(recipe => ({
      id: recipe._id,
      title: recipe.title,
      description: recipe.description,
      image: recipe.image,
      cuisine: recipe.cuisine,
      prepTime: recipe.prepTime,
      servings: recipe.servings,
      likeCount: recipe.likeCount,
      saveCount: recipe.saveCount,
      averageRating: recipe.averageRating,
      createdAt: recipe.createdAt
    }))
  };

  return successResponse(res, 'User profile retrieved', profile);
});

/**
 * @desc    Follow/Unfollow a user
 * @route   POST /api/users/:id/follow
 * @access  Private
 */
export const toggleFollow = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (id === req.user._id.toString()) {
    return errorResponse(res, 'Cannot follow yourself', 400);
  }

  const targetUser = await User.findById(id);
  if (!targetUser) {
    return errorResponse(res, 'User not found', 404);
  }

  const currentUser = await User.findById(req.user._id);
  const isFollowing = currentUser.isFollowing(id);

  if (isFollowing) {
    // Unfollow
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { following: id }
    });
    await User.findByIdAndUpdate(id, {
      $pull: { followers: req.user._id }
    });
    return successResponse(res, 'User unfollowed successfully');
  } else {
    // Follow
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { following: id }
    });
    await User.findByIdAndUpdate(id, {
      $addToSet: { followers: req.user._id }
    });
    return successResponse(res, 'User followed successfully');
  }
});

/**
 * @desc    Get user's followers
 * @route   GET /api/users/:id/followers
 * @access  Public
 */
export const getUserFollowers = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { page, limit, skip } = getPagination(req.query);

  const user = await User.findById(id);
  if (!user) {
    return errorResponse(res, 'User not found', 404);
  }

  const total = user.followers.length;
  
  const followers = await User.find({ _id: { $in: user.followers } })
    .select('name username avatar bio')
    .skip(skip)
    .limit(limit);

  return paginatedResponse(res, followers, page, limit, total);
});

/**
 * @desc    Get user's following
 * @route   GET /api/users/:id/following
 * @access  Public
 */
export const getUserFollowing = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { page, limit, skip } = getPagination(req.query);

  const user = await User.findById(id);
  if (!user) {
    return errorResponse(res, 'User not found', 404);
  }

  const total = user.following.length;
  
  const following = await User.find({ _id: { $in: user.following } })
    .select('name username avatar bio')
    .skip(skip)
    .limit(limit);

  return paginatedResponse(res, following, page, limit, total);
});

/**
 * @desc    Search users
 * @route   GET /api/users/search
 * @access  Public
 */
export const searchUsers = asyncHandler(async (req, res) => {
  const { q } = req.query;
  const { page, limit, skip } = getPagination(req.query);

  if (!q || q.trim().length < 2) {
    return errorResponse(res, 'Search query must be at least 2 characters', 400);
  }

  const searchQuery = {
    $or: [
      { name: { $regex: q, $options: 'i' } },
      { username: { $regex: q, $options: 'i' } }
    ]
  };

  const total = await User.countDocuments(searchQuery);
  
  const users = await User.find(searchQuery)
    .select('name username avatar bio followers')
    .skip(skip)
    .limit(limit)
    .sort({ followers: -1 });

  return paginatedResponse(res, users, page, limit, total);
});

/**
 * @desc    Get all users (admin only)
 * @route   GET /api/users
 * @access  Private/Admin
 */
export const getAllUsers = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);

  const total = await User.countDocuments();
  
  const users = await User.find()
    .select('-password')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  return paginatedResponse(res, users, page, limit, total);
});

/**
 * @desc    Delete user account
 * @route   DELETE /api/users/me
 * @access  Private
 */
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  // Delete all user's recipes
  await Recipe.deleteMany({ user: req.user._id });

  // Remove user from followers/following of other users
  await User.updateMany(
    { $or: [{ followers: req.user._id }, { following: req.user._id }] },
    { $pull: { followers: req.user._id, following: req.user._id } }
  );

  // Delete user
  await User.findByIdAndDelete(req.user._id);

  return successResponse(res, 'Account deleted successfully');
});

export default {
  registerUser,
  loginUser,
  getCurrentUser,
  updateUserProfile,
  changePassword,
  getUserByUsername,
  toggleFollow,
  getUserFollowers,
  getUserFollowing,
  searchUsers,
  getAllUsers,
  deleteUser
};
