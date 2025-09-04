import React, { useState, useEffect } from 'react';
import { usePostsStore } from '../store/postsStore';
import { useAuthStore } from '../store/authStore';
import { useTranslation } from '../hooks/useTranslation';
import PostCard from '../components/PostCard';
import CreatePostModal from '../components/CreatePostModal';

const FeedPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'following' | 'my'>('all');
  const [postType, setPostType] = useState<'all' | 'tip' | 'alert' | 'route' | 'general'>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { 
    posts, 
    isLoading, 
    error, 
    fetchPosts, 
    clearError,
    pagination 
  } = usePostsStore();
  
  const { user } = useAuthStore();
  const { t } = useTranslation();

  useEffect(() => {
    const params = {
      following: activeTab === 'following',
      userId: activeTab === 'my' ? user?._id : undefined,
      type: postType === 'all' ? undefined : postType,
      page: 1,
      limit: 10
    };
    fetchPosts(params);
  }, [activeTab, postType, user?._id, fetchPosts]);

  const canCreatePost = () => {
    if (!user) return false;
    return user.level >= 3 || user.isPremium || user.subscriptionTier !== 'basic';
  };

  const getTabCount = (tab: string) => {
    // This would come from API in a real app
    switch (tab) {
      case 'all': return pagination?.totalPosts || 0;
      case 'following': return '•';
      case 'my': return posts.filter(p => p.userId._id === user?._id).length;
      default: return 0;
    }
  };

  const loadMorePosts = () => {
    if (pagination?.hasNextPage) {
      const params = {
        following: activeTab === 'following',
        userId: activeTab === 'my' ? user?._id : undefined,
        type: postType === 'all' ? undefined : postType,
        page: pagination.currentPage + 1,
        limit: 10
      };
      fetchPosts(params);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Community Feed</h1>
            
            {canCreatePost() && (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <span>✏️</span>
                <span>Create Post</span>
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className="flex space-x-6 mt-4">
            <button
              onClick={() => setActiveTab('all')}
              className={`pb-2 border-b-2 transition-colors ${
                activeTab === 'all'
                  ? 'border-blue-600 text-blue-600 font-medium'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              All Posts ({getTabCount('all')})
            </button>
            
            {user && (
              <>
                <button
                  onClick={() => setActiveTab('following')}
                  className={`pb-2 border-b-2 transition-colors ${
                    activeTab === 'following'
                      ? 'border-blue-600 text-blue-600 font-medium'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Following {getTabCount('following')}
                </button>
                
                <button
                  onClick={() => setActiveTab('my')}
                  className={`pb-2 border-b-2 transition-colors ${
                    activeTab === 'my'
                      ? 'border-blue-600 text-blue-600 font-medium'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  My Posts ({getTabCount('my')})
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Filter by type:</span>
          <select
            value={postType}
            onChange={(e) => setPostType(e.target.value as any)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="general">💭 General</option>
            <option value="tip">💡 Tips</option>
            <option value="alert">⚠️ Alerts</option>
            <option value="route">🛣️ Routes</option>
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 pb-8">
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
            <button
              onClick={clearError}
              className="float-right text-red-500 hover:text-red-700 ml-4"
            >
              ×
            </button>
          </div>
        )}

        {!canCreatePost() && activeTab === 'my' && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <span className="text-blue-600">ℹ️</span>
              <div>
                <p className="text-blue-800 font-medium">Want to create posts?</p>
                <p className="text-blue-700 text-sm">
                  Reach level 3 or upgrade to premium to start sharing your insights with the community.
                </p>
              </div>
            </div>
          </div>
        )}

        {isLoading && posts.length === 0 ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-600 mb-4">
              {activeTab === 'following' 
                ? "Posts from people you follow will appear here."
                : activeTab === 'my'
                ? "Your posts will appear here."
                : "Be the first to share something with the community!"
              }
            </p>
            {canCreatePost() && activeTab !== 'following' && (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Create Your First Post
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  onUserClick={(userId) => {
                    // Navigate to user profile
                    console.log('Navigate to user:', userId);
                  }}
                  onLocationClick={(location) => {
                    // Show location on map
                    console.log('Show location:', location);
                  }}
                />
              ))}
            </div>

            {/* Load More */}
            {pagination?.hasNextPage && (
              <div className="text-center mt-8">
                <button
                  onClick={loadMorePosts}
                  disabled={isLoading}
                  className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 disabled:opacity-50 transition-colors"
                >
                  {isLoading ? 'Loading...' : 'Load More Posts'}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default FeedPage;