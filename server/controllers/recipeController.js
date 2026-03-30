import Recipe from '../models/Recipe.js';
import User from '../models/User.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getPagination, buildPaginationMeta } from '../utils/pagination.js';

/**
 * @desc    Create a new recipe
 * @route   POST /api/recipes
 * @access  Private
 */
export const createRecipe = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    image,
    cuisine,
    prepTime,
    servings,
    ingredients,
    instructions,
    alternativeIngredients,
    tags,
    difficulty
  } = req.body;

  const recipe = await Recipe.create({
    user: req.user._id,
    title,
    description,
    image: image || null,
    cuisine,
    prepTime,
    servings,
    ingredients,
    instructions,
    alternativeIngredients: alternativeIngredients || [],
    tags: tags || [],
    difficulty: difficulty || 'Medium'
  });

  const populatedRecipe = await Recipe.findById(recipe._id)
    .populate('user', 'name username avatar');

  return successResponse(
    res,
    'Recipe created successfully',
    populatedRecipe,
    201
  );
});

/**
 * @desc    Get all recipes with pagination and filters
 * @route   GET /api/recipes
 * @access  Public
 */
export const getAllRecipes = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const { cuisine, difficulty, maxTime, search, userId } = req.query;

  // Build query
  const query = { isPublished: true };

  if (cuisine) query.cuisine = cuisine;
  if (difficulty) query.difficulty = difficulty;
  if (maxTime) query.prepTime = { $lte: parseInt(maxTime) };
  if (userId) query.user = userId;
  
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } }
    ];
  }

  const total = await Recipe.countDocuments(query);
  
  const recipes = await Recipe.find(query)
    .populate('user', 'name username avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  // Add user-specific data if authenticated
  const enhancedRecipes = recipes.map(recipe => ({
    ...recipe,
    isLiked: req.user ? recipe.likes.some(id => id.toString() === req.user._id.toString()) : false,
    isSaved: req.user ? recipe.saves.some(id => id.toString() === req.user._id.toString()) : false,
    userRating: req.user ? recipe.ratings.find(r => r.user.toString() === req.user._id.toString())?.rating || null : null
  }));

  return paginatedResponse(res, enhancedRecipes, page, limit, total);
});

/**
 * @desc    Get recipe by ID
 * @route   GET /api/recipes/:id
 * @access  Public
 */
export const getRecipeById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const recipe = await Recipe.findById(id)
    .populate('user', 'name username avatar bio followers')
    .populate('comments.user', 'name username avatar')
    .populate('likes', 'name username avatar')
    .populate('ratings.user', 'name username avatar');

  if (!recipe) {
    return errorResponse(res, 'Recipe not found', 404);
  }

  if (!recipe.isPublished && recipe.user._id.toString() !== req.user?._id.toString()) {
    return errorResponse(res, 'Recipe not found', 404);
  }

  // Enhance response with user-specific data
  const enhancedRecipe = {
    ...recipe.toObject(),
    isLiked: req.user ? recipe.isLikedBy(req.user._id) : false,
    isSaved: req.user ? recipe.isSavedBy(req.user._id) : false,
    userRating: req.user ? recipe.getUserRating(req.user._id) : null,
    isOwner: req.user ? recipe.user._id.toString() === req.user._id.toString() : false
  };

  return successResponse(res, 'Recipe retrieved', enhancedRecipe);
});

/**
 * @desc    Update recipe
 * @route   PUT /api/recipes/:id
 * @access  Private
 */
export const updateRecipe = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const recipe = await Recipe.findById(id);

  if (!recipe) {
    return errorResponse(res, 'Recipe not found', 404);
  }

  // Check ownership
  if (recipe.user.toString() !== req.user._id.toString()) {
    return errorResponse(res, 'Not authorized to update this recipe', 403);
  }

  const updatedRecipe = await Recipe.findByIdAndUpdate(
    id,
    updates,
    { new: true, runValidators: true }
  ).populate('user', 'name username avatar');

  return successResponse(res, 'Recipe updated successfully', updatedRecipe);
});

/**
 * @desc    Delete recipe
 * @route   DELETE /api/recipes/:id
 * @access  Private
 */
export const deleteRecipe = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const recipe = await Recipe.findById(id);

  if (!recipe) {
    return errorResponse(res, 'Recipe not found', 404);
  }

  // Check ownership
  if (recipe.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return errorResponse(res, 'Not authorized to delete this recipe', 403);
  }

  // Remove recipe from users' saved and liked arrays
  await User.updateMany(
    { $or: [{ savedRecipes: id }, { likedRecipes: id }] },
    { $pull: { savedRecipes: id, likedRecipes: id } }
  );

  await Recipe.findByIdAndDelete(id);

  return successResponse(res, 'Recipe deleted successfully');
});

/**
 * @desc    Like/Unlike a recipe
 * @route   POST /api/recipes/:id/like
 * @access  Private
 */
export const toggleLike = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const recipe = await Recipe.findById(id);
  if (!recipe) {
    return errorResponse(res, 'Recipe not found', 404);
  }

  const isLiked = recipe.isLikedBy(req.user._id);

  if (isLiked) {
    // Unlike
    await Recipe.findByIdAndUpdate(id, {
      $pull: { likes: req.user._id }
    });
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { likedRecipes: id }
    });
    return successResponse(res, 'Recipe unliked');
  } else {
    // Like
    await Recipe.findByIdAndUpdate(id, {
      $addToSet: { likes: req.user._id }
    });
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { likedRecipes: id }
    });
    return successResponse(res, 'Recipe liked');
  }
});

/**
 * @desc    Save/Unsave a recipe
 * @route   POST /api/recipes/:id/save
 * @access  Private
 */
export const toggleSave = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const recipe = await Recipe.findById(id);
  if (!recipe) {
    return errorResponse(res, 'Recipe not found', 404);
  }

  const isSaved = recipe.isSavedBy(req.user._id);

  if (isSaved) {
    // Unsave
    await Recipe.findByIdAndUpdate(id, {
      $pull: { saves: req.user._id }
    });
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { savedRecipes: id }
    });
    return successResponse(res, 'Recipe removed from saved');
  } else {
    // Save
    await Recipe.findByIdAndUpdate(id, {
      $addToSet: { saves: req.user._id }
    });
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { savedRecipes: id }
    });
    return successResponse(res, 'Recipe saved');
  }
});

/**
 * @desc    Rate a recipe
 * @route   POST /api/recipes/:id/rate
 * @access  Private
 */
export const rateRecipe = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { rating } = req.body;

  const recipe = await Recipe.findById(id);
  if (!recipe) {
    return errorResponse(res, 'Recipe not found', 404);
  }

  // Check if user already rated
  const existingRatingIndex = recipe.ratings.findIndex(
    r => r.user.toString() === req.user._id.toString()
  );

  if (existingRatingIndex >= 0) {
    // Update existing rating
    recipe.ratings[existingRatingIndex].rating = rating;
  } else {
    // Add new rating
    recipe.ratings.push({ user: req.user._id, rating });
  }

  await recipe.save();

  return successResponse(res, 'Rating submitted', {
    averageRating: recipe.averageRating,
    totalRatings: recipe.ratings.length
  });
});

/**
 * @desc    Add comment to recipe
 * @route   POST /api/recipes/:id/comments
 * @access  Private
 */
export const addComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  const recipe = await Recipe.findById(id);
  if (!recipe) {
    return errorResponse(res, 'Recipe not found', 404);
  }

  const comment = {
    user: req.user._id,
    text
  };

  recipe.comments.push(comment);
  await recipe.save();

  const populatedRecipe = await Recipe.findById(id)
    .populate('comments.user', 'name username avatar');

  const newComment = populatedRecipe.comments[populatedRecipe.comments.length - 1];

  return successResponse(res, 'Comment added', newComment, 201);
});

/**
 * @desc    Delete comment from recipe
 * @route   DELETE /api/recipes/:id/comments/:commentId
 * @access  Private
 */
export const deleteComment = asyncHandler(async (req, res) => {
  const { id, commentId } = req.params;

  const recipe = await Recipe.findById(id);
  if (!recipe) {
    return errorResponse(res, 'Recipe not found', 404);
  }

  const comment = recipe.comments.id(commentId);
  if (!comment) {
    return errorResponse(res, 'Comment not found', 404);
  }

  // Check ownership (comment owner, recipe owner, or admin)
  if (
    comment.user.toString() !== req.user._id.toString() &&
    recipe.user.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    return errorResponse(res, 'Not authorized to delete this comment', 403);
  }

  recipe.comments.pull(commentId);
  await recipe.save();

  return successResponse(res, 'Comment deleted');
});

/**
 * @desc    Get trending recipes
 * @route   GET /api/recipes/trending
 * @access  Public
 */
export const getTrendingRecipes = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;

  const recipes = await Recipe.find({ isPublished: true })
    .populate('user', 'name username avatar')
    .sort({ likes: -1, createdAt: -1 })
    .limit(limit)
    .lean();

  const enhancedRecipes = recipes.map(recipe => ({
    ...recipe,
    isLiked: req.user ? recipe.likes.some(id => id.toString() === req.user._id.toString()) : false,
    isSaved: req.user ? recipe.saves.some(id => id.toString() === req.user._id.toString()) : false
  }));

  return successResponse(res, 'Trending recipes retrieved', enhancedRecipes);
});

/**
 * @desc    Get user's saved recipes
 * @route   GET /api/recipes/saved
 * @access  Private
 */
export const getSavedRecipes = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);

  const user = await User.findById(req.user._id);
  const total = user.savedRecipes.length;

  const recipes = await Recipe.find({
    _id: { $in: user.savedRecipes },
    isPublished: true
  })
    .populate('user', 'name username avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const enhancedRecipes = recipes.map(recipe => ({
    ...recipe,
    isLiked: recipe.likes.some(id => id.toString() === req.user._id.toString()),
    isSaved: true
  }));

  return paginatedResponse(res, enhancedRecipes, page, limit, total);
});

/**
 * @desc    Get user's liked recipes
 * @route   GET /api/recipes/liked
 * @access  Private
 */
export const getLikedRecipes = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);

  const user = await User.findById(req.user._id);
  const total = user.likedRecipes.length;

  const recipes = await Recipe.find({
    _id: { $in: user.likedRecipes },
    isPublished: true
  })
    .populate('user', 'name username avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const enhancedRecipes = recipes.map(recipe => ({
    ...recipe,
    isLiked: true,
    isSaved: recipe.saves.some(id => id.toString() === req.user._id.toString())
  }));

  return paginatedResponse(res, enhancedRecipes, page, limit, total);
});

/**
 * @desc    Get recipes by user
 * @route   GET /api/recipes/user/:userId
 * @access  Public
 */
export const getUserRecipes = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { page, limit, skip } = getPagination(req.query);

  const query = { user: userId, isPublished: true };
  
  // Allow users to see their own unpublished recipes
  if (req.user && req.user._id.toString() === userId) {
    delete query.isPublished;
  }

  const total = await Recipe.countDocuments(query);
  
  const recipes = await Recipe.find(query)
    .populate('user', 'name username avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const enhancedRecipes = recipes.map(recipe => ({
    ...recipe,
    isLiked: req.user ? recipe.likes.some(id => id.toString() === req.user._id.toString()) : false,
    isSaved: req.user ? recipe.saves.some(id => id.toString() === req.user._id.toString()) : false
  }));

  return paginatedResponse(res, enhancedRecipes, page, limit, total);
});

/**
 * @desc    Get feed recipes (from followed users)
 * @route   GET /api/recipes/feed
 * @access  Private
 */
export const getFeedRecipes = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);

  const user = await User.findById(req.user._id);
  const following = user.following;

  // Include own recipes and followed users' recipes
  const query = {
    $or: [
      { user: { $in: following } },
      { user: req.user._id }
    ],
    isPublished: true
  };

  const total = await Recipe.countDocuments(query);
  
  const recipes = await Recipe.find(query)
    .populate('user', 'name username avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const enhancedRecipes = recipes.map(recipe => ({
    ...recipe,
    isLiked: recipe.likes.some(id => id.toString() === req.user._id.toString()),
    isSaved: recipe.saves.some(id => id.toString() === req.user._id.toString())
  }));

  return paginatedResponse(res, enhancedRecipes, page, limit, total);
});

export default {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  toggleLike,
  toggleSave,
  rateRecipe,
  addComment,
  deleteComment,
  getTrendingRecipes,
  getSavedRecipes,
  getLikedRecipes,
  getUserRecipes,
  getFeedRecipes
};
