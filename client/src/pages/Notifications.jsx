import { motion } from 'framer-motion';
import { Bell, Heart, MessageCircle, UserPlus, ChefHat, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRecipes } from '../context/RecipeContext';
import { Link } from 'react-router-dom';

export default function Notifications() {
  const { user } = useAuth();
  const { getUserNotifications, markNotificationRead, getRecipeById } = useRecipes();

  if (!user) return null;

  const notifications = getUserNotifications(user.id);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return <Heart className="w-5 h-5 text-red-500 fill-red-500" />;
      case 'comment':
        return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case 'follow':
        return <UserPlus className="w-5 h-5 text-green-500" />;
      case 'recipe':
        return <ChefHat className="w-5 h-5 text-orange-500" />;
      default:
        return <Bell className="w-5 h-5 text-stone-500" />;
    }
  };

  const getNotificationLink = (notification) => {
    switch (notification.type) {
      case 'like':
      case 'comment':
        return `/recipe/${notification.relatedId}`;
      case 'follow':
        return `/profile/${notification.relatedId}`;
      default:
        return '#';
    }
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

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="relative p-3 bg-orange-100 dark:bg-orange-500/20 rounded-xl">
              <Bell className="w-6 h-6 text-orange-500" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
                Notifications
              </h1>
              <p className="text-stone-500 dark:text-stone-400">
                {unreadCount > 0 
                  ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
                  : 'You\'re all caught up!'}
              </p>
            </div>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={() => notifications.filter(n => !n.read).forEach(n => markNotificationRead(n.id))}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded-lg transition-colors"
            >
              <Check className="w-4 h-4" />
              Mark all read
            </button>
          )}
        </motion.div>

        {/* Notifications List */}
        <div className="space-y-3">
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={getNotificationLink(notification)}
                  onClick={() => !notification.read && markNotificationRead(notification.id)}
                  className={`flex items-start gap-4 p-4 rounded-xl transition-all ${
                    notification.read
                      ? 'bg-white dark:bg-stone-900'
                      : 'bg-orange-50 dark:bg-orange-500/10 border-l-4 border-orange-500'
                  } hover:shadow-md`}
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-white dark:bg-stone-800 rounded-full flex items-center justify-center shadow-sm">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${notification.read ? 'text-stone-600 dark:text-stone-400' : 'text-stone-900 dark:text-stone-100 font-medium'}`}>
                      {notification.message}
                    </p>
                    <p className="text-xs text-stone-400 mt-1">
                      {formatDate(notification.createdAt)}
                    </p>
                  </div>

                  {!notification.read && (
                    <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0 mt-2" />
                  )}
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-stone-300 dark:text-stone-700 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-stone-900 dark:text-stone-100 mb-2">
                No notifications yet
              </h3>
              <p className="text-stone-500 dark:text-stone-400">
                We'll notify you when something happens
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
