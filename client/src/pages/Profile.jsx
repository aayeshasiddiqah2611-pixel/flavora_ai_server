import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChefHat, Heart, Bookmark } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRecipes } from '../context/RecipeContext';
import ProfileHeader from '../components/user/ProfileHeader';
import RecipeGrid from '../components/recipe/RecipeGrid';

export default function Profile() {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const { getUserRecipes, getSavedRecipes, getLikedRecipes, getUserById } = useRecipes();
  
  const userId = id || currentUser?.id;
  const user = getUserById(userId);
  
  const [activeTab, setActiveTab] = useState('recipes');

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950">
        <div className="text-center">
          <ChefHat className="w-16 h-16 text-stone-300 dark:text-stone-700 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
            User not found
          </h2>
        </div>
      </div>
    );
  }

  const userRecipes = getUserRecipes(userId);
  const savedRecipes = getSavedRecipes(userId);
  const likedRecipes = getLikedRecipes(userId);

  const tabs = [
    { id: 'recipes', label: 'Recipes', icon: ChefHat, count: userRecipes.length },
    { id: 'saved', label: 'Saved', icon: Bookmark, count: savedRecipes.length },
    { id: 'liked', label: 'Liked', icon: Heart, count: likedRecipes.length },
  ];

  const getCurrentRecipes = () => {
    switch (activeTab) {
      case 'saved':
        return savedRecipes;
      case 'liked':
        return likedRecipes;
      default:
        return userRecipes;
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <ProfileHeader userId={userId} />

        {/* Tabs */}
        <div className="mt-8 bg-white dark:bg-stone-900 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-800 overflow-hidden">
          <div className="flex border-b border-stone-200 dark:border-stone-800">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 font-medium transition-all ${
                    isActive
                      ? 'text-orange-500 border-b-2 border-orange-500 bg-orange-50/50 dark:bg-orange-500/5'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-50 dark:hover:bg-stone-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="text-sm text-stone-400">({tab.count})</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {getCurrentRecipes().length > 0 ? (
                <RecipeGrid recipes={getCurrentRecipes()} columns={3} />
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    {activeTab === 'recipes' && <ChefHat className="w-8 h-8 text-stone-400" />}
                    {activeTab === 'saved' && <Bookmark className="w-8 h-8 text-stone-400" />}
                    {activeTab === 'liked' && <Heart className="w-8 h-8 text-stone-400" />}
                  </div>
                  <h3 className="text-lg font-medium text-stone-900 dark:text-stone-100 mb-2">
                    No {activeTab} recipes yet
                  </h3>
                  <p className="text-stone-500 dark:text-stone-400">
                    {activeTab === 'recipes' 
                      ? 'Start sharing your culinary creations!' 
                      : activeTab === 'saved'
                      ? 'Recipes you save will appear here'
                      : 'Recipes you like will appear here'}
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
