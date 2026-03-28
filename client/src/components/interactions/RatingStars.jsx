import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRecipes } from '../../context/RecipeContext';

export default function RatingStars({ recipeId, ratings, size = 'md', showCount = true }) {
  const { user, isAuthenticated } = useAuth();
  const { rateRecipe } = useRecipes();
  const [hoverRating, setHoverRating] = useState(0);

  const userRating = user 
    ? ratings.find(r => r.userId === user.id)?.rating || 0 
    : 0;
  
  const averageRating = ratings.length > 0
    ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
    : 0;

  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const handleRate = (rating) => {
    if (!isAuthenticated || !user) return;
    rateRecipe(recipeId, user.id, rating);
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = hoverRating 
            ? star <= hoverRating 
            : star <= (userRating || Math.round(averageRating));
          
          return (
            <motion.button
              key={star}
              onClick={() => handleRate(star)}
              onMouseEnter={() => isAuthenticated && setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              whileTap={{ scale: 0.9 }}
              disabled={!isAuthenticated}
              className={`${isAuthenticated ? 'cursor-pointer' : 'cursor-not-allowed'} transition-colors`}
            >
              <Star
                className={`${sizeClasses[size]} transition-all ${
                  isFilled
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-stone-300 dark:text-stone-600 hover:text-yellow-300'
                }`}
              />
            </motion.button>
          );
        })}
      </div>
      {showCount && ratings.length > 0 && (
        <span className="text-xs text-stone-500 ml-1">
          ({averageRating.toFixed(1)})
        </span>
      )}
    </div>
  );
}
