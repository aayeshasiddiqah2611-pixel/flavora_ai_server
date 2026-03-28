import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ChefHat } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRecipes } from '../context/RecipeContext';
import RecipeCard from '../components/recipe/RecipeCard';

export default function HomeFeed() {
  const { user, isAuthenticated } = useAuth();
  const { recipes, users, getUserById } = useRecipes();
  const [feedRecipes, setFeedRecipes] = useState([]);

  useEffect(() => {
    if (isAuthenticated && user?.following?.length > 0) {
      // Show recipes from followed users first, then other recipes
      const followedRecipes = recipes.filter(r => 
        user.following.includes(r.userId) || r.userId === user.id
      );
      const otherRecipes = recipes.filter(r => 
        !user.following.includes(r.userId) && r.userId !== user.id
      );
      setFeedRecipes([...followedRecipes, ...otherRecipes]);
    } else {
      // Show all recipes sorted by date
      setFeedRecipes([...recipes].sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      ));
    }
  }, [recipes, user, isAuthenticated]);

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 dark:bg-orange-500/20 rounded-xl">
                <Sparkles className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
                  Good to see you, {user?.name?.split(' ')[0]}!
                </h1>
                <p className="text-stone-500 dark:text-stone-400">
                  Discover what your friends are cooking today
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-3 mb-3">
                <ChefHat className="w-8 h-8" />
                <h1 className="text-2xl font-bold">Welcome to Flavora</h1>
              </div>
              <p className="text-orange-100">
                Join our community to share recipes, connect with food lovers, and discover amazing dishes.
              </p>
            </div>
          )}
        </motion.div>

        {/* Feed */}
        <div className="space-y-6">
          {feedRecipes.length > 0 ? (
            feedRecipes.map((recipe, index) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <RecipeCard recipe={recipe} showComments={true} />
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12">
              <ChefHat className="w-16 h-16 text-stone-300 dark:text-stone-700 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-stone-900 dark:text-stone-100 mb-2">
                No recipes yet
              </h3>
              <p className="text-stone-500 dark:text-stone-400">
                Be the first to share a recipe with the community!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
