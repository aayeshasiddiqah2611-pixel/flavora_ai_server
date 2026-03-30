import express from 'express';
import {
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
} from '../controllers/userController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { userValidation, paginationValidation } from '../middleware/validator.js';

const router = express.Router();

// Public routes
router.post('/register', userValidation.register, registerUser);
router.post('/login', userValidation.login, loginUser);
router.get('/search', paginationValidation, searchUsers);
router.get('/:username', getUserByUsername);
router.get('/:id/followers', paginationValidation, getUserFollowers);
router.get('/:id/following', paginationValidation, getUserFollowing);

// Protected routes
router.get('/me', protect, getCurrentUser);
router.put('/me', protect, userValidation.update, updateUserProfile);
router.put('/me/password', protect, userValidation.changePassword, changePassword);
router.delete('/me', protect, deleteUser);
router.post('/:id/follow', protect, toggleFollow);

// Admin routes
router.get('/', protect, adminOnly, paginationValidation, getAllUsers);

export default router;
