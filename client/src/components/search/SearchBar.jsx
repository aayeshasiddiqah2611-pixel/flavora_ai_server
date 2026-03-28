import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';

export default function SearchBar({ onSearch, placeholder = 'Search recipes...' }) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-2xl">
      <motion.div
        animate={{
          boxShadow: isFocused 
            ? '0 0 0 3px rgba(249, 115, 22, 0.2)' 
            : '0 0 0 0px rgba(249, 115, 22, 0)'
        }}
        className="relative flex items-center bg-white dark:bg-stone-900 rounded-full border border-stone-200 dark:border-stone-700 overflow-hidden"
      >
        <Search className="absolute left-4 w-5 h-5 text-stone-400" />
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-3 bg-transparent text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none"
        />

        {query && (
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={handleClear}
            className="absolute right-4 p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </motion.button>
        )}
      </motion.div>
    </form>
  );
}
