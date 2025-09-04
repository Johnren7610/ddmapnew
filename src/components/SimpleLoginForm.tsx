import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';

const SimpleLoginForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const { login, register, isLoading, error, clearError } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      if (isLogin) {
        await login({
          email: formData.email,
          password: formData.password
        });
      } else {
        if (formData.password !== formData.confirmPassword) {
          alert('Passwords do not match');
          return;
        }
        await register({
          username: formData.username,
          email: formData.email,
          password: formData.password
        });
      }
    } catch (error) {
      // Error handled in store
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-end mb-6">
            <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
              <option value="zh">中文</option>
              <option value="en">English</option>
            </select>
          </div>
          <div className="mb-8">
            <div className="w-16 h-16 bg-green-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl text-white font-bold">D</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{letterSpacing: '-0.02em'}}>
              DDmap
            </h1>
            <p className="text-gray-600 font-medium">
              司机专用点评网站
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Driver's Exclusive Review Platform
            </p>
          </div>
        </div>
        
        <div className="card max-w-md mx-auto p-8">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            {isLogin ? '登录' : '注册'}
          </h2>
          
          {isLogin && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg">
              <div className="flex items-start space-x-2">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                  <span className="text-white text-xs">i</span>
                </div>
                <div className="text-sm">
                  <p className="font-semibold mb-1">演示账号</p>
                  <p>邮箱: test@ddmap.com</p>
                  <p>密码: 123456</p>
                </div>
              </div>
            </div>
          )}
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs">!</span>
                </div>
                <span className="text-sm font-medium">{error}</span>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  用户名
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="请输入用户名"
                  required
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                邮箱地址
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="请输入邮箱地址"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                密码
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                placeholder="请输入密码"
                required
              />
            </div>
            
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  确认密码
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="请再次输入密码"
                  required
                />
              </div>
            )}
            
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{isLogin ? '登录中...' : '注册中...'}</span>
                </div>
              ) : (
                isLogin ? '登录账户' : '创建账户'
              )}
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              {isLogin ? '还没有账号？' : '已有账号？'}{' '}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-green-600 hover:text-green-700 font-semibold transition-colors duration-200"
              >
                {isLogin ? '立即注册' : '立即登录'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleLoginForm;