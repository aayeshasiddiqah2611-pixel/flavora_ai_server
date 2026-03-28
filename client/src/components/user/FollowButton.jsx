import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRecipes } from '../../context/RecipeContext';

export default function FollowButton({ targetUserId, size = 'md' }) {
  const { user, isAuthenticated } = useAuth();
  const { followUser, addNotification } = useRecipes();
  const [isAnimating, setIsAnimating] = useState(false);

  if (!isAuthenticated || !user || user.id === targetUserId) {
    return null;
  }

  const isFollowing = user.following?.includes(targetUserId);

  const sizeClasses = {
    sm: 'px-3 py-1 text-xs',
    md: 'px-4 py-1.5 text-sm',
    lg: 'px-6 py-2 text-base',
  };

  const handleFollow = () => {
    setIsAnimating(true);
    followUser(user.id, targetUserId);
    
    if (!isFollowing) {
      addNotification(
        targetUserId,
        'follow',
        `${user.name} started following you`
      );
    }

    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <motion.button
      onClick={handleFollow}
      whileTap={{ scale: 0.95 }}
      animate={isAnimating ? { scale: [1, 1.1, 1] } : {}}
      className={`flex items-center gap-1.5 font-medium rounded-full transition-all ${
        isFollowing
          ? 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-300 dark:hover:bg-stone-600'
          : 'bg-orange-500 text-white hover:bg-orange-600'
      } ${sizeClasses[size]}`}
    >
      {isFollowing ? (
        <>
          <UserCheck className="w-4 h-4" />
          <span>Following</span>
        </>
      ) : (
        <>
          <UserPlus className="w-4 h-4" />
          <span>Follow</span>
        </>
      )}
    </motion.button>
  );
}
