import { createContext, useContext, useState, useEffect } from 'react';
import { mockRecipes, mockUsers } from '../data/mockData';

const RecipeContext = createContext();

export function RecipeProvider({ children }) {
  const [recipes, setRecipes] = useState(() => {
    const stored = localStorage.getItem('flavora_recipes');
    return stored ? JSON.parse(stored) : mockRecipes;
  });
  
  const [users, setUsers] = useState(() => {
    const stored = localStorage.getItem('flavora_users');
    return stored ? JSON.parse(stored) : mockUsers;
  });

  const [notifications, setNotifications] = useState(() => {
    const stored = localStorage.getItem('flavora_notifications');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('flavora_recipes', JSON.stringify(recipes));
  }, [recipes]);

  useEffect(() => {
    localStorage.setItem('flavora_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('flavora_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addRecipe = (recipe) => {
    const newRecipe = {
      id: Date.now().toString(),
      ...recipe,
      likes: [],
      comments: [],
      saves: [],
      ratings: [],
      createdAt: new Date().toISOString(),
    };
    setRecipes(prev => [newRecipe, ...prev]);
    return newRecipe;
  };

  const updateRecipe = (id, updates) => {
    setRecipes(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const deleteRecipe = (id) => {
    setRecipes(prev => prev.filter(r => r.id !== id));
  };

  const likeRecipe = (recipeId, userId) => {
    setRecipes(prev => prev.map(recipe => {
      if (recipe.id === recipeId) {
        const likes = recipe.likes.includes(userId)
          ? recipe.likes.filter(id => id !== userId)
          : [...recipe.likes, userId];
        return { ...recipe, likes };
      }
      return recipe;
    }));
  };

  const saveRecipe = (recipeId, userId) => {
    setRecipes(prev => prev.map(recipe => {
      if (recipe.id === recipeId) {
        const saves = recipe.saves.includes(userId)
          ? recipe.saves.filter(id => id !== userId)
          : [...recipe.saves, userId];
        return { ...recipe, saves };
      }
      return recipe;
    }));
  };

  const rateRecipe = (recipeId, userId, rating) => {
    setRecipes(prev => prev.map(recipe => {
      if (recipe.id === recipeId) {
        const existingIndex = recipe.ratings.findIndex(r => r.userId === userId);
        let newRatings;
        if (existingIndex >= 0) {
          newRatings = [...recipe.ratings];
          newRatings[existingIndex] = { userId, rating };
        } else {
          newRatings = [...recipe.ratings, { userId, rating }];
        }
        return { ...recipe, ratings: newRatings };
      }
      return recipe;
    }));
  };

  const addComment = (recipeId, userId, userName, userAvatar, text) => {
    const comment = {
      id: Date.now().toString(),
      userId,
      userName,
      userAvatar,
      text,
      createdAt: new Date().toISOString(),
    };
    setRecipes(prev => prev.map(recipe => {
      if (recipe.id === recipeId) {
        return { ...recipe, comments: [...recipe.comments, comment] };
      }
      return recipe;
    }));
  };

  const followUser = (userId, targetUserId) => {
    setUsers(prev => prev.map(user => {
      if (user.id === userId) {
        const following = user.following.includes(targetUserId)
          ? user.following.filter(id => id !== targetUserId)
          : [...user.following, targetUserId];
        return { ...user, following };
      }
      if (user.id === targetUserId) {
        const followers = user.followers.includes(userId)
          ? user.followers.filter(id => id !== userId)
          : [...user.followers, userId];
        return { ...user, followers };
      }
      return user;
    }));
  };

  const addNotification = (userId, type, message, relatedId = null) => {
    const notification = {
      id: Date.now().toString(),
      userId,
      type,
      message,
      relatedId,
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications(prev => [notification, ...prev]);
  };

  const markNotificationRead = (notificationId) => {
    setNotifications(prev => prev.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    ));
  };

  const getRecipeById = (id) => recipes.find(r => r.id === id);
  const getUserById = (id) => users.find(u => u.id === id);
  const getUserRecipes = (userId) => recipes.filter(r => r.userId === userId);
  const getSavedRecipes = (userId) => recipes.filter(r => r.saves.includes(userId));
  const getLikedRecipes = (userId) => recipes.filter(r => r.likes.includes(userId));
  const getTrendingRecipes = () => [...recipes].sort((a, b) => b.likes.length - a.likes.length).slice(0, 10);
  const getUserNotifications = (userId) => notifications.filter(n => n.userId === userId);

  return (
    <RecipeContext.Provider value={{
      recipes,
      users,
      notifications,
      addRecipe,
      updateRecipe,
      deleteRecipe,
      likeRecipe,
      saveRecipe,
      rateRecipe,
      addComment,
      followUser,
      addNotification,
      markNotificationRead,
      getRecipeById,
      getUserById,
      getUserRecipes,
      getSavedRecipes,
      getLikedRecipes,
      getTrendingRecipes,
      getUserNotifications,
    }}>
      {children}
    </RecipeContext.Provider>
  );
}

export function useRecipes() {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error('useRecipes must be used within a RecipeProvider');
  }
  return context;
}
