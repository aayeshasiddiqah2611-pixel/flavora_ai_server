import { motion } from 'framer-motion';
import RecipeCard from './RecipeCard';

export default function RecipeGrid({ recipes, columns = 3 }) {
  if (recipes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-stone-500 dark:text-stone-400">No recipes found</p>
      </div>
    );
  }

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`grid ${gridCols[columns]} gap-6`}
    >
      {recipes.map((recipe, index) => (
        <motion.div
          key={recipe.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <RecipeCard recipe={recipe} />
        </motion.div>
      ))}
    </motion.div>
  );
}
