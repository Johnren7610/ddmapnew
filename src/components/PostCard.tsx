import React, { useState } from 'react';
import { Post } from '../api/posts';
import { usePostsStore } from '../store/postsStore';
import { useAuthStore } from '../store/authStore';
import { useTranslation } from '../hooks/useTranslation';

interface PostCardProps {
  post: Post;
  onUserClick?: (userId: string) => void;
  onLocationClick?: (location: { latitude: number; longitude: number; address?: string }) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onUserClick, onLocationClick }) => {
  const [isLiking, setIsLiking] = useState(false);
  const { likePost, deletePost, subscribeToUser, unsubscribeFromUser } = usePostsStore();
  const { user } = useAuthStore();
  const { t } = useTranslation();

  const isOwner = user?._id === post.userId._id;
  const isLiked = user ? post.likes.includes(user._id) : false;

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case 'tip': return '💡';
      case 'alert': return '⚠️';
      case 'route': return '🛣️';
      default: return '📝';
    }
  };

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case 'tip': return 'bg-blue-100 text-blue-800';
      case 'alert': return 'bg-red-100 text-red-800';
      case 'route': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUserBadge = (user: Post['userId']) => {
    if (user.isVerified) {
      return <span className="text-blue-500 ml-1">✓</span>;
    }
    if (user.isPremium || user.subscriptionTier !== 'basic') {
      return <span className="text-yellow-500 ml-1">★</span>;
    }
    return null;
  };

  const handleLike = async () => {
    if (!user || isLiking) return;

    setIsLiking(true);
    try {
      await likePost(post._id);
    } catch (error) {
      console.error('Failed to like post:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = async () => {
    if (!isOwner) return;

    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(post._id);
      } catch (error) {
        console.error('Failed to delete post:', error);
      }
    }
  };

  const handleSubscribe = async () => {
    if (!user || isOwner) return;

    try {
      await subscribeToUser(post.userId._id);
    } catch (error) {
      console.error('Failed to subscribe:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 24 * 7) {
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 border border-gray-200 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div
            className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold cursor-pointer"
            onClick={() => onUserClick?.(post.userId._id)}
          >
            {post.userId.username.charAt(0).toUpperCase()}
          </div>
          
          <div>
            <div className="flex items-center">
              <span
                className="font-semibold text-gray-900 cursor-pointer hover:text-blue-600"
                onClick={() => onUserClick?.(post.userId._id)}
              >
                {post.userId.username}
              </span>
              {getUserBadge(post.userId)}
              <span className="text-sm text-gray-500 ml-2">
                Level {post.userId.level}
              </span>
            </div>
            <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPostTypeColor(post.type)}`}>
            {getPostTypeIcon(post.type)} {post.type.charAt(0).toUpperCase() + post.type.slice(1)}
          </span>
          
          {post.isPinned && (
            <span className="text-yellow-500">📌</span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h3>
        <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
      </div>

      {/* Location */}
      {post.location && (
        <div
          className="mb-4 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
          onClick={() => onLocationClick?.(post.location!)}
        >
          <div className="flex items-center space-x-2">
            <span>📍</span>
            <span className="text-sm text-gray-700">
              {post.location.address || `${post.location.latitude.toFixed(6)}, ${post.location.longitude.toFixed(6)}`}
            </span>
          </div>
        </div>
      )}

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLike}
            disabled={!user || isLiking}
            className={`flex items-center space-x-2 px-3 py-1 rounded-md transition-colors ${
              isLiked
                ? 'bg-red-100 text-red-600 hover:bg-red-200'
                : 'text-gray-600 hover:bg-gray-100'
            } ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span>{isLiked ? '❤️' : '🤍'}</span>
            <span className="text-sm">{post.likesCount}</span>
          </button>

          <button className="flex items-center space-x-2 text-gray-600 hover:bg-gray-100 px-3 py-1 rounded-md transition-colors">
            <span>💬</span>
            <span className="text-sm">{post.commentsCount}</span>
          </button>

          <button className="text-gray-600 hover:bg-gray-100 px-3 py-1 rounded-md transition-colors">
            <span>🔗</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          {!isOwner && user && (
            <button
              onClick={handleSubscribe}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
            >
              Subscribe
            </button>
          )}

          {isOwner && (
            <button
              onClick={handleDelete}
              className="text-red-600 hover:bg-red-100 px-3 py-1 rounded-md transition-colors"
            >
              🗑️
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;