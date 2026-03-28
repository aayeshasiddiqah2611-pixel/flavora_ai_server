import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Compass, TrendingUp, Clock } from 'lucide-react';
import { useRecipes } from '../context/RecipeContext';
import RecipeGrid from '../components/recipe/RecipeGrid';
import SearchBar from '../components/search/SearchBar';
import CategoryFilter from '../components/search/CategoryFilter';

export default function Explore() {
  const { recipes } = useRecipes();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('latest'); // 'latest', 'popular'

  const filteredRecipes = useMemo(() => {
    let result = [...recipes];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(recipe =>
        recipe.title.toLowerCase().includes(query) ||
        recipe.description.toLowerCase().includes(query) ||
        recipe.ingredients.some(ing => 
          ing.name.toLowerCase().includes(query)
        ) ||
        recipe.cuisine.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      result = result.filter(recipe => recipe.cuisine === selectedCategory);
    }

    // Sort
    if (sortBy === 'popular') {
      result.sort((a, b) => b.likes.length - a.likes.length);
    } else {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
  }, [recipes, searchQuery, selectedCategory, sortBy]);

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
            <div className="p-3 bg-orange-100 dark:bg-orange-500/20 rounded-xl">
              <Compass className="w-6 h-6 text-orange-500" />
            </div>
            <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-100">
              Explore Recipes
            </h1>
          </div>
          <p className="text-stone-500 dark:text-stone-400">
            Discover dishes from around the world
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <SearchBar 
            onSearch={setSearchQuery}
            placeholder="Search by recipe name, ingredients, or cuisine..."
          />
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 space-y-4"
        >
          <CategoryFilter
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
          
          {/* Sort Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setSortBy('latest')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                sortBy === 'latest'
                  ? 'bg-orange-500 text-white'
                  : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700 hover:border-orange-300'
              }`}
            >
              <Clock className="w-4 h-4" />
              Latest
            </button>
            <button
              onClick={() => setSortBy('popular')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                sortBy === 'popular'
                  ? 'bg-orange-500 text-white'
                  : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700 hover:border-orange-300'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Popular
            </button>
          </div>
        </motion.div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-stone-500 dark:text-stone-400">
            {filteredRecipes.length} {filteredRecipes.length === 1 ? 'recipe' : 'recipes'} found
          </p>
        </div>

        {/* Recipe Grid */}
        <RecipeGrid recipes={filteredRecipes} columns={3} />
      </div>
    </div>
  );
}
