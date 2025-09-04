import api from './auth';

export interface Post {
  _id: string;
  title: string;
  content: string;
  type: 'tip' | 'alert' | 'route' | 'general';
  userId: {
    _id: string;
    username: string;
    level: number;
    isPremium: boolean;
    subscriptionTier: string;
    isVerified: boolean;
  };
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  tags: string[];
  likes: string[];
  likesCount: number;
  commentsCount: number;
  isPublic: boolean;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostData {
  title: string;
  content: string;
  type: 'tip' | 'alert' | 'route' | 'general';
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  tags?: string[];
  isPublic?: boolean;
}

export interface PostsResponse {
  posts: Post[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalPosts: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface Subscription {
  _id: string;
  subscriberId: string;
  targetUserId: {
    _id: string;
    username: string;
    level: number;
    isPremium: boolean;
    subscriptionTier: string;
    isVerified: boolean;
  };
  notificationSettings: {
    newPosts: boolean;
    newAnnotations: boolean;
    liveUpdates: boolean;
  };
  createdAt: string;
}

export const postsApi = {
  // 帖子相关
  createPost: async (data: CreatePostData): Promise<{ message: string; post: Post }> => {
    const response = await api.post('/posts', data);
    return response.data;
  },

  getPosts: async (params?: {
    page?: number;
    limit?: number;
    type?: string;
    userId?: string;
    tags?: string;
    following?: boolean;
  }): Promise<PostsResponse> => {
    const response = await api.get('/posts', { params });
    return response.data;
  },

  getPostById: async (id: string): Promise<{ post: Post }> => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },

  likePost: async (id: string): Promise<{ message: string; liked: boolean; likesCount: number }> => {
    const response = await api.post(`/posts/${id}/like`);
    return response.data;
  },

  deletePost: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  },

  // 订阅相关
  subscribeToUser: async (userId: string): Promise<{ message: string }> => {
    const response = await api.post(`/posts/subscribe/${userId}`);
    return response.data;
  },

  unsubscribeFromUser: async (userId: string): Promise<{ message: string }> => {
    const response = await api.delete(`/posts/subscribe/${userId}`);
    return response.data;
  },

  getMySubscriptions: async (): Promise<{ subscriptions: Subscription[] }> => {
    const response = await api.get('/posts/subscriptions/my');
    return response.data;
  },
};