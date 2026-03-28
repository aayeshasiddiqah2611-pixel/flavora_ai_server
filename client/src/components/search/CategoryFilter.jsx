import { motion } from 'framer-motion';
import { cuisineCategories } from '../../data/mockData';

export default function CategoryFilter({ selected, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2">
      {cuisineCategories.map((category) => {
        const isSelected = selected === category;
        
        return (
          <motion.button
            key={category}
            onClick={() => onSelect(category)}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              isSelected
                ? 'bg-orange-500 text-white shadow-md'
                : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700 hover:border-orange-300 dark:hover:border-orange-700 hover:text-orange-500'
            }`}
          >
            {category}
          </motion.button>
        );
      })}
    </div>
  );
}
