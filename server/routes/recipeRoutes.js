import express from 'express';
import {
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
} from '../controllers/recipeController.js';
import { protect, optionalAuth } from '../middleware/auth.js';
import { 
  recipeValidation, 
  paginationValidation, 
  idParamValidation 
} from '../middleware/validator.js';

const router = express.Router();

// Public routes with optional auth
router.get('/', optionalAuth, paginationValidation, getAllRecipes);
router.get('/trending', optionalAuth, getTrendingRecipes);
router.get('/user/:userId', optionalAuth, paginationValidation, getUserRecipes);
router.get('/:id', optionalAuth, idParamValidation, getRecipeById);

// Protected routes
router.post('/', protect, recipeValidation.create, createRecipe);
router.put('/:id', protect, idParamValidation, recipeValidation.update, updateRecipe);
router.delete('/:id', protect, idParamValidation, deleteRecipe);

// Like/Save routes
router.post('/:id/like', protect, idParamValidation, toggleLike);
router.post('/:id/save', protect, idParamValidation, toggleSave);

// Rating routes
router.post('/:id/rate', protect, idParamValidation, recipeValidation.rate, rateRecipe);

// Comment routes
router.post('/:id/comments', protect, idParamValidation, recipeValidation.comment, addComment);
router.delete('/:id/comments/:commentId', protect, idParamValidation, deleteComment);

// User-specific recipe routes
router.get('/saved/list', protect, paginationValidation, getSavedRecipes);
router.get('/liked/list', protect, paginationValidation, getLikedRecipes);
router.get('/feed/list', protect, paginationValidation, getFeedRecipes);

export default router;
