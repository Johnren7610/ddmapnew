import api from './auth';

export interface Notification {
  _id: string;
  userId: string;
  type: 'follow' | 'like' | 'comment' | 'new_post' | 'new_annotation';
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
  unreadCount: number;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalNotifications: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export const notificationsApi = {
  getNotifications: async (params?: {
    page?: number;
    limit?: number;
    unreadOnly?: boolean;
  }): Promise<NotificationsResponse> => {
    const response = await api.get('/notifications', { params });
    return response.data;
  },

  getUnreadCount: async (): Promise<{ unreadCount: number }> => {
    const response = await api.get('/notifications/unread-count');
    return response.data;
  },

  markAsRead: async (id: string): Promise<{ message: string }> => {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async (): Promise<{ message: string }> => {
    const response = await api.patch('/notifications/read-all');
    return response.data;
  },

  deleteNotification: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  },
};