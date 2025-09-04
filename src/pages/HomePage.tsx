import React from 'react';
import { useAuthStore } from '../store/authStore';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useTranslation } from '../hooks/useTranslation';

const HomePage: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { t } = useTranslation();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                {t('app.title')}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">{t('app.welcome')}, {user?.username}</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {t('app.level')} {user?.level}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {t('app.score')} {user?.score}
                </span>
              </div>
              
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {t('app.logout')}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 主要内容区域 */}
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              功能导航
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  {t('home.mapAnnotation')}
                </h3>
                <p className="text-blue-700 text-sm mb-4">
                  {t('home.mapAnnotationDesc')}
                </p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
                  {t('home.startAnnotating')}
                </button>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-green-900 mb-2">
                  {t('home.browseAnnotations')}
                </h3>
                <p className="text-green-700 text-sm mb-4">
                  {t('home.browseAnnotationsDesc')}
                </p>
                <button className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700">
                  {t('home.browseNow')}
                </button>
              </div>

              <div className="bg-orange-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-orange-900 mb-2">
                  Community Feed
                </h3>
                <p className="text-orange-700 text-sm mb-4">
                  Share tips, alerts and follow other drivers
                </p>
                <button className="bg-orange-600 text-white px-4 py-2 rounded text-sm hover:bg-orange-700">
                  Join Community
                </button>
                {(user?.level && user.level >= 3) || user?.isPremium ? (
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      ✏️ Can post
                    </span>
                  </div>
                ) : (
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                      📖 View only
                    </span>
                  </div>
                )}
              </div>
              
              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-900 mb-2">
                  {t('home.profile')}
                </h3>
                <p className="text-purple-700 text-sm mb-4">
                  {t('home.profileDesc')}
                </p>
                <button className="bg-purple-600 text-white px-4 py-2 rounded text-sm hover:bg-purple-700">
                  {t('home.viewProfile')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 用户统计信息 */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{user?.level}</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      当前等级
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      等级 {user?.level}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold text-sm">★</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      总积分
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {user?.score} 分
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold text-sm">♥</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      粉丝数量
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {user?.followersCount || 0} 人
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;