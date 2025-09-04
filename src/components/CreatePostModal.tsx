import React, { useState } from 'react';
import { usePostsStore } from '../store/postsStore';
import { useTranslation } from '../hooks/useTranslation';
import { CreatePostData } from '../api/posts';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialLocation?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, initialLocation }) => {
  const [formData, setFormData] = useState<CreatePostData>({
    title: '',
    content: '',
    type: 'general',
    location: initialLocation,
    tags: [],
    isPublic: true
  });
  const [tagInput, setTagInput] = useState('');

  const { createPost, isLoading, error, clearError } = usePostsStore();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      return;
    }

    try {
      await createPost(formData);
      onClose();
      
      // Reset form
      setFormData({
        title: '',
        content: '',
        type: 'general',
        location: undefined,
        tags: [],
        isPublic: true
      });
      setTagInput('');
    } catch (error) {
      // Error handled in store
    }
  };

  const handleTagAdd = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = tagInput.trim().toLowerCase();
      if (tag && !formData.tags?.includes(tag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...(prev.tags || []), tag]
        }));
        setTagInput('');
      }
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const handleLocationRemove = () => {
    setFormData(prev => ({
      ...prev,
      location: undefined
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Create New Post</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
              <button
                type="button"
                onClick={clearError}
                className="float-right text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          )}

          {/* Post Type */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Post Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="general">💭 General</option>
              <option value="tip">💡 Tip</option>
              <option value="alert">⚠️ Alert</option>
              <option value="route">🛣️ Route</option>
            </select>
          </div>

          {/* Title */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="What's your post about?"
              maxLength={200}
              required
            />
            <p className="text-xs text-gray-500 mt-1">{formData.title.length}/200</p>
          </div>

          {/* Content */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Share your insights, tips, or information..."
              rows={6}
              maxLength={5000}
              required
            />
            <p className="text-xs text-gray-500 mt-1">{formData.content.length}/5000</p>
          </div>

          {/* Location */}
          {formData.location && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div className="flex items-center space-x-2">
                  <span>📍</span>
                  <span className="text-sm text-gray-700">
                    {formData.location.address || `${formData.location.latitude.toFixed(6)}, ${formData.location.longitude.toFixed(6)}`}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleLocationRemove}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            </div>
          )}

          {/* Tags */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagAdd}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add tags (press Enter or comma to add)"
            />
            {formData.tags && formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleTagRemove(tag)}
                      className="ml-1 text-blue-500 hover:text-blue-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Visibility */}
          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isPublic}
                onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Make this post public</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !formData.title.trim() || !formData.content.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Creating...' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;