import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Flame, Sparkles, ChefHat } from 'lucide-react';
import { useRecipes } from '../context/RecipeContext';
import RecipeCard from '../components/recipe/RecipeCard';
import RecipeGrid from '../components/recipe/RecipeGrid';

export default function Trending() {
  const { recipes, getTrendingRecipes } = useRecipes();

  const trendingRecipes = useMemo(() => getTrendingRecipes(), [recipes]);
  
  const curatedRecipes = useMemo(() => {
    return [...recipes]
      .sort((a, b) => (b.ratings.length + b.saves.length) - (a.ratings.length + a.saves.length))
      .slice(0, 6);
  }, [recipes]);

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">
              Trending Now
            </h1>
          </div>
          <p className="text-stone-500 dark:text-stone-400">
            Discover what's cooking in the community
          </p>
        </motion.div>

        {/* What's Cooking Right Now - Horizontal Scroll */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Flame className="w-5 h-5 text-orange-500" />
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
              What's Cooking Right Now
            </h2>
          </div>
          
          <div className="overflow-x-auto pb-4 -mx-4 px-4">
            <div className="flex gap-6" style={{ minWidth: 'max-content' }}>
              {trendingRecipes.slice(0, 5).map((recipe, index) => (
                <motion.div
                  key={recipe.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="w-80 flex-shrink-0"
                >
                  <RecipeCard recipe={recipe} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Trending Flavors */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
              Trending Flavors
            </h2>
          </div>
          
          <RecipeGrid recipes={trendingRecipes} columns={4} />
        </section>

        {/* Flavors You'll Love */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-orange-500" />
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
              Flavors You'll Love
            </h2>
          </div>
          
          <div className="bg-gradient-to-r from-orange-500/10 to-pink-500/10 dark:from-orange-500/5 dark:to-pink-500/5 rounded-2xl p-6">
            <RecipeGrid recipes={curatedRecipes} columns={3} />
          </div>
        </section>

        {/* Discover Your Next Favorite Dish */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <ChefHat className="w-5 h-5 text-orange-500" />
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
              Discover Your Next Favorite Dish
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recipes.slice(0, 4).map((recipe, index) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-stone-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="flex">
                  <div className="w-1/3">
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-full h-full object-cover min-h-[150px]"
                    />
                  </div>
                  <div className="w-2/3 p-4">
                    <span className="text-xs font-medium text-orange-500 uppercase tracking-wide">
                      {recipe.cuisine}
                    </span>
                    <h3 className="font-bold text-stone-900 dark:text-stone-100 mt-1 mb-2 line-clamp-1">
                      {recipe.title}
                    </h3>
                    <p className="text-sm text-stone-500 dark:text-stone-400 line-clamp-2">
                      {recipe.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
