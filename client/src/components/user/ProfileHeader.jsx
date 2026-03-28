import { MapPin, Link as LinkIcon, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRecipes } from '../../context/RecipeContext';
import UserAvatar from './UserAvatar';
import FollowButton from './FollowButton';

export default function ProfileHeader({ userId }) {
  const { user: currentUser, isAuthenticated } = useAuth();
  const { getUserById, getUserRecipes } = useRecipes();
  
  const user = getUserById(userId);
  const userRecipes = getUserRecipes(userId);
  
  if (!user) return null;

  const isOwnProfile = isAuthenticated && currentUser?.id === userId;
  const stats = [
    { label: 'Recipes', value: userRecipes.length },
    { label: 'Followers', value: user.followers?.length || 0 },
    { label: 'Following', value: user.following?.length || 0 },
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 md:p-8 shadow-sm border border-stone-200 dark:border-stone-800">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Avatar */}
        <UserAvatar
          src={user.avatar}
          name={user.name}
          size="2xl"
          className="flex-shrink-0"
        />

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-stone-900 dark:text-stone-100">
                {user.name}
              </h1>
              <p className="text-stone-500 dark:text-stone-400">@{user.username}</p>
            </div>
            
            {!isOwnProfile && (
              <FollowButton targetUserId={userId} size="md" />
            )}
          </div>

          {user.bio && (
            <p className="text-stone-700 dark:text-stone-300 mb-4 max-w-2xl">
              {user.bio}
            </p>
          )}

          <div className="flex flex-wrap gap-4 text-sm text-stone-500 dark:text-stone-400 mb-4">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Joined {formatDate(user.createdAt)}
            </span>
          </div>

          {/* Stats */}
          <div className="flex gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center md:text-left">
                <span className="block text-xl font-bold text-stone-900 dark:text-stone-100">
                  {stat.value}
                </span>
                <span className="text-sm text-stone-500 dark:text-stone-400">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
