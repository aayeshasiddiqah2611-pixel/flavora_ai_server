import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRecipes } from '../../context/RecipeContext';
import UserAvatar from '../user/UserAvatar';

export default function CommentSection({ recipeId, comments, compact = false }) {
  const { user, isAuthenticated } = useAuth();
  const { addComment, addNotification, getRecipeById } = useRecipes();
  const [newComment, setNewComment] = useState('');
  const [isExpanded, setIsExpanded] = useState(!compact);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim() || !isAuthenticated || !user) return;

    addComment(recipeId, user.id, user.name, user.avatar, newComment.trim());
    
    const recipe = getRecipeById(recipeId);
    if (recipe && recipe.userId !== user.id) {
      addNotification(
        recipe.userId,
        'comment',
        `${user.name} commented on your recipe "${recipe.title}"`,
        recipeId
      );
    }

    setNewComment('');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const displayedComments = compact && !isExpanded 
    ? comments.slice(0, 2) 
    : comments;

  return (
    <div className="space-y-4">
      {/* Comment Count & Toggle */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm font-medium">
            {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
          </span>
        </button>
        {compact && comments.length > 2 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-orange-500 hover:text-orange-600 font-medium"
          >
            {isExpanded ? 'Show less' : 'View all'}
          </button>
        )}
      </div>

      {/* Comments List */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            {displayedComments.map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <UserAvatar
                  src={comment.userAvatar}
                  name={comment.userName}
                  size="sm"
                />
                <div className="flex-1 min-w-0">
                  <div className="bg-stone-100 dark:bg-stone-800 rounded-2xl rounded-tl-none px-4 py-2">
                    <p className="font-medium text-sm text-stone-900 dark:text-stone-100">
                      {comment.userName}
                    </p>
                    <p className="text-stone-700 dark:text-stone-300 text-sm">
                      {comment.text}
                    </p>
                  </div>
                  <p className="text-xs text-stone-500 mt-1 ml-1">
                    {formatDate(comment.createdAt)}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Comment */}
      {isAuthenticated && (
        <form onSubmit={handleSubmit} className="flex gap-3">
          <UserAvatar
            src={user?.avatar}
            name={user?.name}
            size="sm"
          />
          <div className="flex-1 relative">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full px-4 py-2 pr-12 bg-stone-100 dark:bg-stone-800 border-0 rounded-full text-stone-900 dark:text-stone-100 placeholder-stone-500 focus:ring-2 focus:ring-orange-500"
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="absolute right-1 top-1/2 -translate-y-1/2 p-2 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
