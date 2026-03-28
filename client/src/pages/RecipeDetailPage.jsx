import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Users, 
  ChefHat, 
  ArrowLeft, 
  Check,
  UtensilsCrossed
} from 'lucide-react';
import { useRecipes } from '../context/RecipeContext';
import { useAuth } from '../context/AuthContext';
import UserAvatar from '../components/user/UserAvatar';
import FollowButton from '../components/user/FollowButton';
import LikeButton from '../components/interactions/LikeButton';
import SaveButton from '../components/interactions/SaveButton';
import RatingStars from '../components/interactions/RatingStars';
import CommentSection from '../components/interactions/CommentSection';

export default function RecipeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { getRecipeById, getUserById } = useRecipes();
  
  const recipe = getRecipeById(id);
  const author = recipe ? getUserById(recipe.userId) : null;

  if (!recipe || !author) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950">
        <div className="text-center">
          <ChefHat className="w-16 h-16 text-stone-300 dark:text-stone-700 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 mb-2">
            Recipe not found
          </h2>
          <button
            onClick={() => navigate('/explore')}
            className="text-orange-500 hover:text-orange-600 font-medium"
          >
            Browse other recipes
          </button>
        </div>
      </div>
    );
  }

  const averageRating = recipe.ratings.length > 0
    ? recipe.ratings.reduce((sum, r) => sum + r.rating, 0) / recipe.ratings.length
    : 0;

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </motion.button>

        {/* Recipe Card */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-stone-900 rounded-3xl overflow-hidden shadow-xl"
        >
          {/* Hero Image */}
          <div className="relative aspect-[16/9] overflow-hidden">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Cuisine Tag */}
            <div className="absolute top-4 left-4">
              <span className="px-4 py-1.5 bg-white/90 dark:bg-stone-900/90 backdrop-blur-sm text-stone-900 dark:text-stone-100 text-sm font-medium rounded-full">
                {recipe.cuisine}
              </span>
            </div>

            {/* Save Button */}
            <div className="absolute top-4 right-4">
              <div className="p-3 bg-white/90 dark:bg-stone-900/90 backdrop-blur-sm rounded-full shadow-lg">
                <SaveButton recipeId={recipe.id} saves={recipe.saves} size="md" />
              </div>
            </div>

            {/* Title Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">
                {recipe.title}
              </h1>
              <div className="flex items-center gap-4 text-white/80 text-sm">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {recipe.prepTime} minutes
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {recipe.servings} servings
                </span>
                <RatingStars recipeId={recipe.id} ratings={recipe.ratings} size="sm" showCount={false} />
                <span className="text-white/60">
                  ({averageRating.toFixed(1)})
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8 space-y-8">
            {/* Author */}
            <div className="flex items-center justify-between pb-6 border-b border-stone-200 dark:border-stone-800">
              <Link 
                to={`/profile/${author.id}`}
                className="flex items-center gap-3 group"
              >
                <UserAvatar src={author.avatar} name={author.name} size="lg" />
                <div>
                  <p className="font-medium text-stone-900 dark:text-stone-100 group-hover:text-orange-500 transition-colors">
                    {author.name}
                  </p>
                  <p className="text-sm text-stone-500 dark:text-stone-400">
                    @{author.username}
                  </p>
                </div>
              </Link>
              <FollowButton targetUserId={author.id} />
            </div>

            {/* Description */}
            <div>
              <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-3">
                About this recipe
              </h2>
              <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                {recipe.description}
              </p>
            </div>

            {/* Interactions */}
            <div className="flex items-center justify-between py-4 border-y border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-6">
                <LikeButton recipeId={recipe.id} likes={recipe.likes} size="lg" />
                <div className="flex items-center gap-2 text-stone-600 dark:text-stone-400">
                  <UtensilsCrossed className="w-5 h-5" />
                  <span className="font-medium">{recipe.ingredients.length} ingredients</span>
                </div>
              </div>
              <RatingStars recipeId={recipe.id} ratings={recipe.ratings} size="lg" />
            </div>

            {/* Ingredients */}
            <div>
              <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-4 flex items-center gap-2">
                <UtensilsCrossed className="w-5 h-5 text-orange-500" />
                Ingredients
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {recipe.ingredients.map((ingredient, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3 p-3 bg-stone-50 dark:bg-stone-800 rounded-xl"
                  >
                    <div className="w-6 h-6 bg-orange-100 dark:bg-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-3.5 h-3.5 text-orange-500" />
                    </div>
                    <span className="text-stone-700 dark:text-stone-300">
                      <span className="font-medium">{ingredient.amount} {ingredient.unit}</span>{' '}
                      {ingredient.name}
                    </span>
                  </motion.li>
                ))}
              </ul>

              {/* Alternative Ingredients */}
              {recipe.alternativeIngredients?.length > 0 && (
                <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-500/10 rounded-xl">
                  <p className="text-sm font-medium text-orange-700 dark:text-orange-400 mb-2">
                    Alternative options:
                  </p>
                  <ul className="text-sm text-orange-600 dark:text-orange-300 space-y-1">
                    {recipe.alternativeIngredients.map((alt, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-orange-400 rounded-full" />
                        {alt}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div>
              <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-4 flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-orange-500" />
                Instructions
              </h2>
              <ol className="space-y-6">
                {recipe.instructions.map((instruction, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {typeof instruction === 'object' ? instruction.step : index + 1}
                    </div>
                    <div className="flex-1">
                      {typeof instruction === 'object' ? (
                        <>
                          <h3 className="font-semibold text-stone-900 dark:text-stone-100 mb-1">
                            {instruction.title}
                          </h3>
                          <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                            {instruction.detail}
                          </p>
                        </>
                      ) : (
                        <p className="text-stone-700 dark:text-stone-300 pt-1 leading-relaxed">
                          {instruction}
                        </p>
                      )}
                    </div>
                  </motion.li>
                ))}
              </ol>
            </div>

            {/* Comments */}
            <div className="pt-6 border-t border-stone-200 dark:border-stone-800">
              <CommentSection 
                recipeId={recipe.id} 
                comments={recipe.comments}
                compact={false}
              />
            </div>
          </div>
        </motion.article>
      </div>
    </div>
  );
}
