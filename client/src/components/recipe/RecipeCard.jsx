import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Users, MessageCircle } from 'lucide-react';
import { useRecipes } from '../../context/RecipeContext';
import UserAvatar from '../user/UserAvatar';
import FollowButton from '../user/FollowButton';
import LikeButton from '../interactions/LikeButton';
import SaveButton from '../interactions/SaveButton';
import RatingStars from '../interactions/RatingStars';

export default function RecipeCard({ recipe, showComments = false }) {
  const { getUserById } = useRecipes();
  const user = getUserById(recipe.userId);

  if (!user) return null;

  const averageRating = recipe.ratings.length > 0
    ? recipe.ratings.reduce((sum, r) => sum + r.rating, 0) / recipe.ratings.length
    : 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-stone-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-200 dark:border-stone-800"
    >
      {/* Image Section */}
      <Link to={`/recipe/${recipe.id}`} className="block relative overflow-hidden group">
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4 }}
          className="aspect-[4/3] overflow-hidden"
        >
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
        </motion.div>
        
        {/* Cuisine Tag */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 bg-black/60 backdrop-blur-sm text-white text-xs font-medium rounded-full">
            {recipe.cuisine}
          </span>
        </div>

        {/* Save Button Overlay */}
        <div className="absolute top-3 right-3">
          <div className="p-2 bg-white/90 dark:bg-stone-900/90 backdrop-blur-sm rounded-full shadow-sm">
            <SaveButton recipeId={recipe.id} saves={recipe.saves} size="sm" />
          </div>
        </div>
      </Link>

      {/* Content Section */}
      <div className="p-4 space-y-3">
        {/* User Info */}
        <div className="flex items-center justify-between">
          <Link 
            to={`/profile/${user.id}`}
            className="flex items-center gap-2 group/user"
          >
            <UserAvatar src={user.avatar} name={user.name} size="sm" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-stone-900 dark:text-stone-100 truncate group-hover/user:text-orange-500 transition-colors">
                {user.name}
              </p>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                @{user.username}
              </p>
            </div>
          </Link>
          <FollowButton targetUserId={user.id} size="sm" />
        </div>

        {/* Recipe Info */}
        <Link to={`/recipe/${recipe.id}`}>
          <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 line-clamp-1 hover:text-orange-500 transition-colors">
            {recipe.title}
          </h3>
          <p className="text-sm text-stone-600 dark:text-stone-400 line-clamp-2 mt-1">
            {recipe.description}
          </p>
        </Link>

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-xs text-stone-500 dark:text-stone-400">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {recipe.prepTime} min
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {recipe.servings} servings
          </span>
          {showComments && (
            <span className="flex items-center gap-1">
              <MessageCircle className="w-3.5 h-3.5" />
              {recipe.comments.length}
            </span>
          )}
        </div>

        {/* Interaction Bar */}
        <div className="flex items-center justify-between pt-3 border-t border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-4">
            <LikeButton recipeId={recipe.id} likes={recipe.likes} />
            <Link 
              to={`/recipe/${recipe.id}`}
              className="flex items-center gap-1.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm font-medium">{recipe.comments.length}</span>
            </Link>
          </div>
          <RatingStars recipeId={recipe.id} ratings={recipe.ratings} size="sm" />
        </div>
      </div>
    </motion.article>
  );
}
