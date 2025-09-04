import { create } from 'zustand';
import { postsApi, Post, CreatePostData, Subscription } from '../api/posts';

interface PostsState {
  posts: Post[];
  currentPost: Post | null;
  subscriptions: Subscription[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalPosts: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  } | null;

  // Actions
  createPost: (data: CreatePostData) => Promise<void>;
  fetchPosts: (params?: any) => Promise<void>;
  fetchPostById: (id: string) => Promise<void>;
  likePost: (id: string) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  subscribeToUser: (userId: string) => Promise<void>;
  unsubscribeFromUser: (userId: string) => Promise<void>;
  fetchSubscriptions: () => Promise<void>;
  clearError: () => void;
  clearCurrentPost: () => void;
}

export const usePostsStore = create<PostsState>((set, get) => ({
  posts: [],
  currentPost: null,
  subscriptions: [],
  isLoading: false,
  error: null,
  pagination: null,

  createPost: async (data: CreatePostData) => {
    try {
      set({ isLoading: true, error: null });
      const response = await postsApi.createPost(data);
      
      // 添加新帖子到列表开头
      set(state => ({
        posts: [response.post, ...state.posts],
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to create post',
        isLoading: false,
      });
      throw error;
    }
  },

  fetchPosts: async (params = {}) => {
    try {
      set({ isLoading: true, error: null });
      const response = await postsApi.getPosts(params);
      
      set({
        posts: response.posts,
        pagination: response.pagination,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch posts',
        isLoading: false,
      });
    }
  },

  fetchPostById: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await postsApi.getPostById(id);
      
      set({
        currentPost: response.post,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch post',
        isLoading: false,
      });
    }
  },

  likePost: async (id: string) => {
    try {
      const response = await postsApi.likePost(id);
      
      // 更新帖子列表中的点赞数
      set(state => ({
        posts: state.posts.map(post =>
          post._id === id
            ? { ...post, likesCount: response.likesCount }
            : post
        ),
        currentPost: state.currentPost?._id === id
          ? { ...state.currentPost, likesCount: response.likesCount }
          : state.currentPost
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to like post',
      });
      throw error;
    }
  },

  deletePost: async (id: string) => {
    try {
      await postsApi.deletePost(id);
      
      // 从列表中移除已删除的帖子
      set(state => ({
        posts: state.posts.filter(post => post._id !== id),
        currentPost: state.currentPost?._id === id ? null : state.currentPost
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to delete post',
      });
      throw error;
    }
  },

  subscribeToUser: async (userId: string) => {
    try {
      await postsApi.subscribeToUser(userId);
      // 重新获取订阅列表
      await get().fetchSubscriptions();
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to subscribe to user',
      });
      throw error;
    }
  },

  unsubscribeFromUser: async (userId: string) => {
    try {
      await postsApi.unsubscribeFromUser(userId);
      // 重新获取订阅列表
      await get().fetchSubscriptions();
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to unsubscribe from user',
      });
      throw error;
    }
  },

  fetchSubscriptions: async () => {
    try {
      const response = await postsApi.getMySubscriptions();
      set({ subscriptions: response.subscriptions });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch subscriptions',
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },

  clearCurrentPost: () => {
    set({ currentPost: null });
  },
}));