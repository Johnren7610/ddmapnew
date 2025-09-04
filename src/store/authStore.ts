import { create } from 'zustand';

interface User {
  id: string;
  username: string;
  email: string;
  score: number;
  level: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => {
  // 从localStorage恢复状态
  const token = localStorage.getItem('ddmap_token');
  const userData = localStorage.getItem('ddmap_user');
  const user = userData ? JSON.parse(userData) : null;

  return {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading: false,
    error: null,

    login: async (data: LoginData) => {
      try {
        set({ isLoading: true, error: null });
        
        // 模拟登录验证
        if (data.email === 'test@ddmap.com' && data.password === '123456') {
          const mockUser: User = {
            id: '1',
            username: '测试司机',
            email: 'test@ddmap.com',
            score: 150,
            level: '活跃司机'
          };
          const mockToken = 'mock-jwt-token-' + Date.now();
          
          localStorage.setItem('ddmap_token', mockToken);
          localStorage.setItem('ddmap_user', JSON.stringify(mockUser));
          
          set({
            user: mockUser,
            token: mockToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          throw new Error('邮箱或密码错误');
        }
      } catch (error: any) {
        set({
          error: error.message || 'Login failed',
          isLoading: false,
        });
        throw error;
      }
    },

    register: async (data: RegisterData) => {
      try {
        set({ isLoading: true, error: null });
        
        // 模拟注册
        const mockUser: User = {
          id: Date.now().toString(),
          username: data.username,
          email: data.email,
          score: 0,
          level: '新手司机'
        };
        const mockToken = 'mock-jwt-token-' + Date.now();
        
        localStorage.setItem('ddmap_token', mockToken);
        localStorage.setItem('ddmap_user', JSON.stringify(mockUser));
        
        set({
          user: mockUser,
          token: mockToken,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error: any) {
        set({
          error: error.message || 'Registration failed',
          isLoading: false,
        });
        throw error;
      }
    },

    logout: () => {
      localStorage.removeItem('ddmap_token');
      localStorage.removeItem('ddmap_user');
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        error: null,
      });
    },

    clearError: () => {
      set({ error: null });
    },
  };
});