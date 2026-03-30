import mongoose from 'mongoose';

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Ingredient name is required'],
    trim: true
  },
  amount: {
    type: String,
    required: [true, 'Amount is required'],
    trim: true
  },
  unit: {
    type: String,
    required: [true, 'Unit is required'],
    trim: true
  }
}, { _id: true });

const instructionSchema = new mongoose.Schema({
  step: {
    type: Number,
    required: [true, 'Step number is required'],
    min: [1, 'Step must be at least 1']
  },
  title: {
    type: String,
    required: [true, 'Step title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  detail: {
    type: String,
    required: [true, 'Step detail is required'],
    trim: true,
    maxlength: [2000, 'Detail cannot exceed 2000 characters']
  }
}, { _id: true });

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: [true, 'Comment text is required'],
    trim: true,
    maxlength: [1000, 'Comment cannot exceed 1000 characters']
  }
}, {
  timestamps: true
});

const ratingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  }
}, { _id: true });

const recipeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  title: {
    type: String,
    required: [true, 'Recipe title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  image: {
    type: String,
    default: null
  },
  cuisine: {
    type: String,
    required: [true, 'Cuisine type is required'],
    trim: true,
    enum: {
      values: ['Italian', 'Indian', 'Japanese', 'Thai', 'American', 'Mexican', 'Chinese', 'Mediterranean', 'French', 'Korean', 'Vietnamese', 'Spanish', 'Greek', 'Other'],
      message: 'Please select a valid cuisine type'
    }
  },
  prepTime: {
    type: Number,
    required: [true, 'Preparation time is required'],
    min: [1, 'Preparation time must be at least 1 minute']
  },
  servings: {
    type: Number,
    required: [true, 'Number of servings is required'],
    min: [1, 'Servings must be at least 1']
  },
  ingredients: {
    type: [ingredientSchema],
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'At least one ingredient is required'
    }
  },
  instructions: {
    type: [instructionSchema],
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'At least one instruction step is required'
    }
  },
  alternativeIngredients: [{
    type: String,
    trim: true
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [commentSchema],
  saves: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  ratings: [ratingSchema],
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  isPublished: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
recipeSchema.index({ user: 1 });
recipeSchema.index({ cuisine: 1 });
recipeSchema.index({ createdAt: -1 });
recipeSchema.index({ likes: 1 });
recipeSchema.index({ tags: 1 });
recipeSchema.index({ title: 'text', description: 'text' });

// Virtual field for like count
recipeSchema.virtual('likeCount').get(function() {
  return this.likes ? this.likes.length : 0;
});

// Virtual field for save count
recipeSchema.virtual('saveCount').get(function() {
  return this.saves ? this.saves.length : 0;
});

// Virtual field for comment count
recipeSchema.virtual('commentCount').get(function() {
  return this.comments ? this.comments.length : 0;
});

// Virtual field for average rating
recipeSchema.virtual('averageRating').get(function() {
  if (!this.ratings || this.ratings.length === 0) return 0;
  const sum = this.ratings.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / this.ratings.length) * 10) / 10;
});

// Method to check if user has liked
recipeSchema.methods.isLikedBy = function(userId) {
  return this.likes.some(id => id.toString() === userId.toString());
};

// Method to check if user has saved
recipeSchema.methods.isSavedBy = function(userId) {
  return this.saves.some(id => id.toString() === userId.toString());
};

// Method to check if user has rated
recipeSchema.methods.getUserRating = function(userId) {
  const rating = this.ratings.find(r => r.user.toString() === userId.toString());
  return rating ? rating.rating : null;
};

// Static method to get trending recipes
recipeSchema.statics.getTrending = async function(limit = 10) {
  return await this.find({ isPublished: true })
    .sort({ likes: -1, createdAt: -1 })
    .limit(limit)
    .populate('user', 'name username avatar')
    .lean();
};

// Static method to search recipes
recipeSchema.statics.search = async function(query, filters = {}) {
  const searchQuery = {
    isPublished: true,
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { tags: { $in: [new RegExp(query, 'i')] } }
    ]
  };

  if (filters.cuisine) searchQuery.cuisine = filters.cuisine;
  if (filters.difficulty) searchQuery.difficulty = filters.difficulty;
  if (filters.maxTime) searchQuery.prepTime = { $lte: filters.maxTime };

  return await this.find(searchQuery)
    .sort({ createdAt: -1 })
    .populate('user', 'name username avatar')
    .lean();
};

const Recipe = mongoose.model('Recipe', recipeSchema);

export default Recipe;
