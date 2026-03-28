import { motion } from 'framer-motion';
import { ChefHat, Heart, Users, Globe, Sparkles } from 'lucide-react';

export default function About() {
  const features = [
    {
      icon: ChefHat,
      title: 'Share Your Recipes',
      description: 'Create and share your favorite recipes with detailed instructions, ingredients, and beautiful photos.',
    },
    {
      icon: Heart,
      title: 'Connect & Engage',
      description: 'Like, comment, and save recipes from fellow food enthusiasts. Build your culinary community.',
    },
    {
      icon: Users,
      title: 'Follow Creators',
      description: 'Follow your favorite chefs and home cooks to stay updated with their latest creations.',
    },
    {
      icon: Globe,
      title: 'Explore Cuisines',
      description: 'Discover recipes from around the world. From Italian to Japanese, find your next favorite dish.',
    },
  ];

  const stats = [
    { value: '10K+', label: 'Recipes Shared' },
    { value: '50K+', label: 'Food Lovers' },
    { value: '100+', label: 'Cuisines' },
    { value: '1M+', label: 'Interactions' },
  ];

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-pink-500/10 dark:from-orange-500/5 dark:to-pink-500/5" />
        
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.8 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-xl mb-8"
          >
            <ChefHat className="w-10 h-10 text-white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold text-stone-900 dark:text-stone-100 mb-6"
          >
            Welcome to{' '}
            <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              Flavora
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-stone-600 dark:text-stone-400 max-w-2xl mx-auto mb-8"
          >
            A social platform where food lovers unite to share, discover, and celebrate 
            the art of cooking. Explore flavors. Create stories.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-2 text-orange-500"
          >
            <Sparkles className="w-5 h-5" />
            <span className="font-medium">Explore flavors. Create stories.</span>
            <Sparkles className="w-5 h-5" />
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 bg-white dark:bg-stone-900 border-y border-stone-200 dark:border-stone-800">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-orange-500 mb-2">
                  {stat.value}
                </div>
                <div className="text-stone-600 dark:text-stone-400">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-stone-900 dark:text-stone-100 mb-4">
              What You Can Do
            </h2>
            <p className="text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
              Flavora is packed with features designed to make your culinary journey 
              more enjoyable and social.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex gap-4 p-6 bg-white dark:bg-stone-900 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-800 hover:shadow-md transition-shadow"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-orange-100 dark:bg-orange-500/20 rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-stone-600 dark:text-stone-400">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-orange-500 to-orange-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              Our Mission
            </h2>
            <p className="text-xl text-orange-100 max-w-2xl mx-auto">
              We believe that food brings people together. Our mission is to create 
              a vibrant community where everyone can share their passion for cooking, 
              learn from others, and discover new flavors from around the world.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer Note */}
      <section className="py-12 px-4 text-center">
        <p className="text-stone-500 dark:text-stone-400">
          Made with{' '}
          <Heart className="w-4 h-4 inline text-red-500 fill-red-500" />{' '}
          for food lovers everywhere
        </p>
      </section>
    </div>
  );
}
