import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRecipes } from '../../context/RecipeContext';

export default function LikeButton({ recipeId, likes, size = 'md' }) {
  const { user, isAuthenticated } = useAuth();
  const { likeRecipe, addNotification, getRecipeById } = useRecipes();
  const [isAnimating, setIsAnimating] = useState(false);

  const isLiked = user ? likes.includes(user.id) : false;
  const likeCount = likes.length;

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleLike = () => {
    if (!isAuthenticated || !user) return;

    setIsAnimating(true);
    likeRecipe(recipeId, user.id);

    if (!isLiked) {
      const recipe = getRecipeById(recipeId);
      if (recipe && recipe.userId !== user.id) {
        addNotification(
          recipe.userId,
          'like',
          `${user.name} liked your recipe "${recipe.title}"`,
          recipeId
        );
      }
    }

    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <button
      onClick={handleLike}
      disabled={!isAuthenticated}
      className={`flex items-center gap-1.5 group transition-colors ${
        isAuthenticated ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
      }`}
    >
      <motion.div
        whileTap={{ scale: 0.8 }}
        animate={isAnimating ? { scale: [1, 1.3, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        <Heart
          className={`${sizeClasses[size]} transition-all ${
            isLiked
              ? 'text-red-500 fill-red-500'
              : 'text-stone-400 group-hover:text-red-400'
          }`}
        />
      </motion.div>
      <span
        className={`text-sm font-medium ${
          isLiked ? 'text-red-500' : 'text-stone-500 group-hover:text-stone-700 dark:group-hover:text-stone-300'
        }`}
      >
        {likeCount}
      </span>
    </button>
  );
}
