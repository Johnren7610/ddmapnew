import api from './auth';

export interface AddressAnnotation {
  _id: string;
  address: string;
  latitude: number;
  longitude: number;
  parkingConvenience: number;
  hasDog: boolean;
  dogAggression?: number;
  tipGiven: boolean;
  tipAmount?: number;
  tipFrequency: 'never' | 'rarely' | 'sometimes' | 'often' | 'always';
  accessDifficulty: number;
  safetyRating: number;
  customerRating: number;
  deliveryTime: {
    morning: boolean;
    afternoon: boolean;
    evening: boolean;
    night: boolean;
  };
  buildingType: 'house' | 'apartment' | 'condo' | 'office' | 'store' | 'other';
  floorNumber?: number;
  hasElevator?: boolean;
  buzzerCode?: string;
  specialInstructions?: string;
  notes?: string;
  userId: {
    _id: string;
    username: string;
    level: number;
    isPremium: boolean;
    subscriptionTier: string;
    isVerified: boolean;
  };
  likes: string[];
  likesCount: number;
  reportCount: number;
  verifiedCount: number;
  isVerified: boolean;
  overallRating: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAnnotationData {
  address: string;
  latitude: number;
  longitude: number;
  parkingConvenience: number;
  hasDog: boolean;
  dogAggression?: number;
  tipGiven: boolean;
  tipAmount?: number;
  tipFrequency: 'never' | 'rarely' | 'sometimes' | 'often' | 'always';
  accessDifficulty: number;
  safetyRating: number;
  customerRating: number;
  deliveryTime: {
    morning: boolean;
    afternoon: boolean;
    evening: boolean;
    night: boolean;
  };
  buildingType: 'house' | 'apartment' | 'condo' | 'office' | 'store' | 'other';
  floorNumber?: number;
  hasElevator?: boolean;
  buzzerCode?: string;
  specialInstructions?: string;
  notes?: string;
}

export interface AnnotationsResponse {
  annotations: AddressAnnotation[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalAnnotations: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export const annotationsApi = {
  // CRUD操作
  createAnnotation: async (data: CreateAnnotationData): Promise<{ message: string; annotation: AddressAnnotation }> => {
    const response = await api.post('/annotations', data);
    return response.data;
  },

  getAnnotations: async (params?: {
    page?: number;
    limit?: number;
    userId?: string;
    minRating?: number;
    maxDistance?: number;
    latitude?: number;
    longitude?: number;
    buildingType?: string;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<AnnotationsResponse> => {
    const response = await api.get('/annotations', { params });
    return response.data;
  },

  getAnnotationById: async (id: string): Promise<{ annotation: AddressAnnotation }> => {
    const response = await api.get(`/annotations/${id}`);
    return response.data;
  },

  updateAnnotation: async (id: string, data: Partial<CreateAnnotationData>): Promise<{ message: string; annotation: AddressAnnotation }> => {
    const response = await api.put(`/annotations/${id}`, data);
    return response.data;
  },

  deleteAnnotation: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/annotations/${id}`);
    return response.data;
  },

  // 交互功能
  likeAnnotation: async (id: string): Promise<{ message: string; liked: boolean; likesCount: number }> => {
    const response = await api.post(`/annotations/${id}/like`);
    return response.data;
  },

  verifyAnnotation: async (id: string): Promise<{ message: string; verifiedCount: number; isVerified: boolean }> => {
    const response = await api.post(`/annotations/${id}/verify`);
    return response.data;
  },

  reportAnnotation: async (id: string, data: { reason: string; description?: string }): Promise<{ message: string }> => {
    const response = await api.post(`/annotations/${id}/report`, data);
    return response.data;
  },

  // 地理位置相关
  getNearbyAnnotations: async (params: {
    latitude: number;
    longitude: number;
    radius?: number;
  }): Promise<{ annotations: AddressAnnotation[] }> => {
    const response = await api.get('/annotations/nearby', { params });
    return response.data;
  },
};