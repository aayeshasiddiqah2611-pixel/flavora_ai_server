import { ChefHat, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-orange-500 rounded-lg">
              <ChefHat className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-stone-900 dark:text-stone-100">
              Flavora
            </span>
          </div>
          
          <p className="text-sm text-stone-500 dark:text-stone-400 text-center">
            Made with{' '}
            <Heart className="w-4 h-4 inline text-red-500 fill-red-500" />{' '}
            for food lovers everywhere
          </p>
          
          <p className="text-sm text-stone-500 dark:text-stone-400">
            {currentYear} Flavora. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
