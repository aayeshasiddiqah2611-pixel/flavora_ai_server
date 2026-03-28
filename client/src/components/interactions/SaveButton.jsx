import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bookmark } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRecipes } from '../../context/RecipeContext';

export default function SaveButton({ recipeId, saves, size = 'md' }) {
  const { user, isAuthenticated } = useAuth();
  const { saveRecipe } = useRecipes();
  const [isAnimating, setIsAnimating] = useState(false);

  const isSaved = user ? saves.includes(user.id) : false;

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleSave = () => {
    if (!isAuthenticated || !user) return;

    setIsAnimating(true);
    saveRecipe(recipeId, user.id);
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <button
      onClick={handleSave}
      disabled={!isAuthenticated}
      className={`flex items-center gap-1.5 group transition-colors ${
        isAuthenticated ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
      }`}
      title={isSaved ? 'Remove from saved' : 'Save recipe'}
    >
      <motion.div
        whileTap={{ scale: 0.8 }}
        animate={isAnimating ? { scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] } : {}}
        transition={{ duration: 0.3 }}
      >
        <Bookmark
          className={`${sizeClasses[size]} transition-all ${
            isSaved
              ? 'text-orange-500 fill-orange-500'
              : 'text-stone-400 group-hover:text-orange-400'
          }`}
        />
      </motion.div>
    </button>
  );
}
