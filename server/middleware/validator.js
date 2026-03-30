import { body, param, query, validationResult } from 'express-validator';
import { errorResponse } from '../utils/apiResponse.js';

/**
 * Handle validation errors
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const extractedErrors = errors.array().map(err => ({
      field: err.path,
      message: err.msg
    }));
    
    return errorResponse(res, 'Validation failed', 400, extractedErrors);
  }
  
  next();
};

/**
 * User validation rules
 */
export const userValidation = {
  register: [
    body('name')
      .trim()
      .notEmpty().withMessage('Name is required')
      .isLength({ max: 50 }).withMessage('Name cannot exceed 50 characters'),
    body('username')
      .trim()
      .notEmpty().withMessage('Username is required')
      .isLength({ min: 3, max: 30 }).withMessage('Username must be 3-30 characters')
      .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores')
      .toLowerCase(),
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Please enter a valid email')
      .normalizeEmail()
      .toLowerCase(),
    body('password')
      .notEmpty().withMessage('Password is required')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('bio')
      .optional()
      .trim()
      .isLength({ max: 500 }).withMessage('Bio cannot exceed 500 characters'),
    handleValidationErrors
  ],
  
  login: [
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Please enter a valid email'),
    body('password')
      .notEmpty().withMessage('Password is required'),
    handleValidationErrors
  ],
  
  update: [
    body('name')
      .optional()
      .trim()
      .isLength({ max: 50 }).withMessage('Name cannot exceed 50 characters'),
    body('bio')
      .optional()
      .trim()
      .isLength({ max: 500 }).withMessage('Bio cannot exceed 500 characters'),
    body('avatar')
      .optional()
      .trim()
      .isURL().withMessage('Avatar must be a valid URL'),
    handleValidationErrors
  ],
  
  changePassword: [
    body('currentPassword')
      .notEmpty().withMessage('Current password is required'),
    body('newPassword')
      .notEmpty().withMessage('New password is required')
      .isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
    handleValidationErrors
  ]
};

/**
 * Recipe validation rules
 */
export const recipeValidation = {
  create: [
    body('title')
      .trim()
      .notEmpty().withMessage('Title is required')
      .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
    body('description')
      .trim()
      .notEmpty().withMessage('Description is required')
      .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),
    body('cuisine')
      .trim()
      .notEmpty().withMessage('Cuisine is required')
      .isIn(['Italian', 'Indian', 'Japanese', 'Thai', 'American', 'Mexican', 'Chinese', 'Mediterranean', 'French', 'Korean', 'Vietnamese', 'Spanish', 'Greek', 'Other'])
      .withMessage('Please select a valid cuisine'),
    body('prepTime')
      .notEmpty().withMessage('Preparation time is required')
      .isInt({ min: 1 }).withMessage('Preparation time must be at least 1 minute'),
    body('servings')
      .notEmpty().withMessage('Servings is required')
      .isInt({ min: 1 }).withMessage('Servings must be at least 1'),
    body('ingredients')
      .isArray({ min: 1 }).withMessage('At least one ingredient is required'),
    body('ingredients.*.name')
      .trim()
      .notEmpty().withMessage('Ingredient name is required'),
    body('ingredients.*.amount')
      .trim()
      .notEmpty().withMessage('Ingredient amount is required'),
    body('ingredients.*.unit')
      .trim()
      .notEmpty().withMessage('Ingredient unit is required'),
    body('instructions')
      .isArray({ min: 1 }).withMessage('At least one instruction is required'),
    body('instructions.*.step')
      .isInt({ min: 1 }).withMessage('Step number must be at least 1'),
    body('instructions.*.title')
      .trim()
      .notEmpty().withMessage('Step title is required'),
    body('instructions.*.detail')
      .trim()
      .notEmpty().withMessage('Step detail is required'),
    body('difficulty')
      .optional()
      .isIn(['Easy', 'Medium', 'Hard']).withMessage('Difficulty must be Easy, Medium, or Hard'),
    handleValidationErrors
  ],
  
  update: [
    body('title')
      .optional()
      .trim()
      .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),
    body('cuisine')
      .optional()
      .trim()
      .isIn(['Italian', 'Indian', 'Japanese', 'Thai', 'American', 'Mexican', 'Chinese', 'Mediterranean', 'French', 'Korean', 'Vietnamese', 'Spanish', 'Greek', 'Other'])
      .withMessage('Please select a valid cuisine'),
    body('prepTime')
      .optional()
      .isInt({ min: 1 }).withMessage('Preparation time must be at least 1 minute'),
    body('servings')
      .optional()
      .isInt({ min: 1 }).withMessage('Servings must be at least 1'),
    body('difficulty')
      .optional()
      .isIn(['Easy', 'Medium', 'Hard']).withMessage('Difficulty must be Easy, Medium, or Hard'),
    handleValidationErrors
  ],
  
  comment: [
    body('text')
      .trim()
      .notEmpty().withMessage('Comment text is required')
      .isLength({ max: 1000 }).withMessage('Comment cannot exceed 1000 characters'),
    handleValidationErrors
  ],
  
  rate: [
    body('rating')
      .notEmpty().withMessage('Rating is required')
      .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    handleValidationErrors
  ]
};

/**
 * Pagination validation
 */
export const paginationValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be at least 1'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  handleValidationErrors
];

/**
 * ID parameter validation
 */
export const idParamValidation = [
  param('id')
    .isMongoId().withMessage('Invalid ID format'),
  handleValidationErrors
];

export default {
  userValidation,
  recipeValidation,
  paginationValidation,
  idParamValidation,
  handleValidationErrors
};
