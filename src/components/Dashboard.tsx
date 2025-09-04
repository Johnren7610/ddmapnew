import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import MapView from './MapView';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuthStore();
  const [currentView, setCurrentView] = useState<'map' | 'profile' | 'annotations' | 'favorites'>('map');
  
  // 模拟收藏的地址数据
  const [favoriteAddresses] = useState([
    {
      id: 1,
      title: '高档公寓楼',
      address: '700 W Georgia St, Vancouver, BC V7Y 1A2',
      overallRating: 4.2,
      parkingRating: 2,
      tipRating: 5,
      hasDog: false,
      noTip: false,
      notes: '市中心高档公寓，停车困难但小费大方，门卫友善',
      groupName: '小费好顾客',
      groupIcon: '💰',
      groupColor: '#22c55e',
      favoriteDate: '2天前'
    },
    {
      id: 2,
      title: '联排别墅区',
      address: '1625 Manitoba St, Vancouver, BC V5Y 0A5',
      overallRating: 2.1,
      parkingRating: 5,
      tipRating: 1,
      hasDog: true,
      noTip: true,
      notes: '停车很便利但零小费！有大型犬需注意安全，客户态度一般',
      groupName: '零小费黑名单',
      groupIcon: '⚠️',
      groupColor: '#ef4444',
      favoriteDate: '5天前'
    },
    {
      id: 3,
      title: '商务办公楼',
      address: '1055 W Hastings St, Vancouver, BC V6E 2E9',
      overallRating: 4.8,
      parkingRating: 4,
      tipRating: 4,
      hasDog: false,
      noTip: false,
      notes: 'CBD核心区域，有地下停车场，客户都很专业礼貌，推荐！',
      groupName: '友善客户',
      groupIcon: '😊',
      groupColor: '#8b5cf6',
      favoriteDate: '1周前'
    }
  ]);

  const handleAddAnnotation = (location: { lat: number; lng: number; address: string }) => {
    console.log('新标注添加:', location);
    // 这里可以将标注保存到状态管理或发送到后端
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
                <span className="text-lg text-white font-bold">D</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">DDmap</h1>
                <span className="text-xs text-gray-500 font-medium">司机专用点评网站</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">欢迎, {user?.username}</p>
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="badge-success">
                      {user?.score || 0} 积分
                    </span>
                    <span className="badge-info">
                      {user?.level || '新手'}
                    </span>
                  </div>
                </div>
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-gray-600">
                    {user?.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
              >
                退出登录
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        <aside className="w-72 bg-white shadow-sm min-h-screen border-r border-gray-100">
          <nav className="mt-6">
            <div className="px-6 space-y-1">
              <button
                onClick={() => setCurrentView('map')}
                className={`w-full flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
                  currentView === 'map' 
                    ? 'bg-green-50 text-green-700 shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="mr-3 text-lg">🗺️</span>
                <span>地图标注</span>
              </button>
              
              <button
                onClick={() => setCurrentView('annotations')}
                className={`w-full flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
                  currentView === 'annotations' 
                    ? 'bg-green-50 text-green-700 shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="mr-3 text-lg">📍</span>
                <span>我的标注</span>
              </button>
              
              <button
                onClick={() => setCurrentView('favorites')}
                className={`w-full flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
                  currentView === 'favorites' 
                    ? 'bg-green-50 text-green-700 shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="mr-3 text-lg">⭐</span>
                <span>我的收藏</span>
              </button>
              
              <button
                onClick={() => setCurrentView('profile')}
                className={`w-full flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
                  currentView === 'profile' 
                    ? 'bg-green-50 text-green-700 shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="mr-3 text-lg">👤</span>
                <span>个人中心</span>
              </button>
            </div>
            
            <div className="mt-8 px-6">
              <div className="bg-green-50 rounded-xl p-4">
                <h4 className="font-semibold text-green-900 text-sm mb-2">今日统计</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-green-700">
                    <span>新增标注</span>
                    <span className="font-semibold">0</span>
                  </div>
                  <div className="flex justify-between text-green-700">
                    <span>获得点赞</span>
                    <span className="font-semibold">3</span>
                  </div>
                  <div className="flex justify-between text-green-700">
                    <span>积分收入</span>
                    <span className="font-semibold">+6</span>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </aside>

        <main className="flex-1 p-8">
          {currentView === 'map' && (
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">地图标注</h2>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">Vancouver, BC</span>
                  <button className="btn-secondary text-sm py-2 px-4">
                    切换区域
                  </button>
                </div>
              </div>
              <div className="h-[600px] rounded-xl overflow-hidden">
                <MapView onAddAnnotation={handleAddAnnotation} />
              </div>
            </div>
          )}

          {currentView === 'annotations' && (
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">我的标注</h2>
                <button 
                  onClick={() => setCurrentView('map')}
                  className="btn-primary text-sm py-2 px-4"
                >
                  + 添加新标注
                </button>
              </div>
              <div className="space-y-4">
                {/* 示例标注数据 - 温哥华地区 */}
                <div className="card p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">Vancouver City Centre</h3>
                    <span className="text-sm text-gray-500">2天前</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">📍 700 W Georgia St, Vancouver, BC V7Y 1A2</p>
                  <div className="flex items-center flex-wrap gap-2 mb-3">
                    <span className="badge-warning">停车一般</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">无狗</span>
                    <span className="badge-info">有小费</span>
                    <span className="text-sm text-gray-500">👍 15</span>
                  </div>
                  <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                    💡 市中心繁忙，建议避开高峰时段，地下停车收费较贵
                  </p>
                </div>

                <div className="card p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">Olympic Village</h3>
                    <span className="text-sm text-gray-500">1周前</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">📍 1625 Manitoba St, Vancouver, BC V5Y 0A5</p>
                  <div className="flex items-center flex-wrap gap-2 mb-3">
                    <span className="badge-success">停车便利</span>
                    <span className="badge-danger">有狗</span>
                    <span className="badge-info">有小费</span>
                    <span className="text-sm text-gray-500">👍 22</span>
                  </div>
                  <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                    💡 居民区友善，有免费路边停车位，注意宠物较多
                  </p>
                </div>
              </div>
            </div>
          )}

          {currentView === 'favorites' && (
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <h2 className="text-2xl font-bold text-gray-900">我的收藏</h2>
                  <span className="badge-info">{favoriteAddresses.length} 个地址</span>
                </div>
                <div className="flex items-center space-x-3">
                  <button className="btn-secondary text-sm py-2 px-4">
                    导出收藏
                  </button>
                  <button 
                    onClick={() => setCurrentView('map')}
                    className="btn-primary text-sm py-2 px-4"
                  >
                    + 添加收藏
                  </button>
                </div>
              </div>

              {/* 收藏统计 */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                {[
                  { name: '小费好顾客', count: 1, color: '#22c55e', icon: '💰' },
                  { name: '零小费黑名单', count: 1, color: '#ef4444', icon: '⚠️' },
                  { name: '友善客户', count: 1, color: '#8b5cf6', icon: '😊' },
                  { name: '停车便利', count: 0, color: '#3b82f6', icon: '🚗' }
                ].map((group) => (
                  <div key={group.name} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <div 
                        className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-xs"
                        style={{ backgroundColor: group.color }}
                      >
                        {group.icon}
                      </div>
                      <span className="text-sm font-medium text-gray-700">{group.name}</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{group.count}</div>
                    <div className="text-xs text-gray-500">个地址</div>
                  </div>
                ))}
              </div>

              {/* 收藏地址列表 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <span className="mr-2">📋</span>
                  收藏地址详情
                </h3>
                
                {favoriteAddresses.map((address) => {
                  const parkingText = address.parkingRating >= 4 ? '停车便利' : address.parkingRating >= 3 ? '停车一般' : '停车困难';
                  const tipText = address.noTip ? '无小费!' : address.tipRating >= 4 ? '小费大方' : address.tipRating >= 3 ? '小费一般' : '小费较少';
                  
                  return (
                    <div key={address.id} className="card p-5">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                            style={{ backgroundColor: address.groupColor }}
                          >
                            {address.groupIcon}
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">{address.title}</h4>
                            <p className="text-sm text-gray-600">{address.address}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xs text-gray-500">收藏到</span>
                              <span 
                                className="text-xs px-2 py-1 rounded-full text-white font-medium"
                                style={{ backgroundColor: address.groupColor }}
                              >
                                {address.groupName}
                              </span>
                              <span className="text-xs text-gray-500">• {address.favoriteDate}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center bg-gray-100 px-3 py-1 rounded-lg">
                            <span className="text-sm mr-1">⭐</span>
                            <span className="font-semibold text-gray-900">{address.overallRating.toFixed(1)}</span>
                          </div>
                          <div className="flex space-x-1">
                            <button className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                            <button className="w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center flex-wrap gap-2 mb-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          address.parkingRating >= 4 ? 'bg-green-100 text-green-800' : 
                          address.parkingRating >= 3 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                        }`}>
                          🚗 {parkingText}
                        </span>
                        {address.hasDog && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            🐕 有恶犬
                          </span>
                        )}
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          address.noTip ? 'bg-red-100 text-red-800' :
                          address.tipRating >= 4 ? 'bg-green-100 text-green-800' : 
                          address.tipRating >= 3 ? 'bg-yellow-100 text-yellow-800' : 'bg-orange-100 text-orange-800'
                        }`}>
                          💰 {tipText}
                        </span>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-gray-600 leading-relaxed">💭 {address.notes}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {currentView === 'profile' && (
            <div className="space-y-6">
              <div className="card p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">个人中心</h2>
                <div className="flex items-center space-x-6">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-green-700">
                      {user?.username?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">{user?.username}</h3>
                    <p className="text-sm text-gray-600 mt-1">{user?.email}</p>
                    <div className="flex items-center space-x-3 mt-3">
                      <span className="badge-success text-sm">
                        {user?.score || 0} 积分
                      </span>
                      <span className="badge-info text-sm">
                        {user?.level || '新手'}
                      </span>
                      <span className="text-sm text-gray-500">加入2天</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-6">
                <div className="card p-6 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-xl mx-auto mb-3 flex items-center justify-center">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{user?.score || 0}</div>
                  <div className="text-sm text-gray-600">总积分</div>
                </div>
                <div className="card p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl mx-auto mb-3 flex items-center justify-center">
                    <span className="text-2xl">📍</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">2</div>
                  <div className="text-sm text-gray-600">标注数量</div>
                </div>
                <div className="card p-6 text-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl mx-auto mb-3 flex items-center justify-center">
                    <span className="text-2xl">⭐</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{favoriteAddresses.length}</div>
                  <div className="text-sm text-gray-600">收藏地址</div>
                </div>
                <div className="card p-6 text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl mx-auto mb-3 flex items-center justify-center">
                    <span className="text-2xl">👑</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{user?.level || '新手'}</div>
                  <div className="text-sm text-gray-600">当前等级</div>
                </div>
              </div>
              
              {/* 收藏快速预览 */}
              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-gray-900 flex items-center">
                    <span className="mr-2">⭐</span>
                    我的收藏夹
                  </h4>
                  <button
                    onClick={() => setCurrentView('favorites')}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    查看全部 →
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {favoriteAddresses.slice(0, 2).map((address) => (
                    <div key={address.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                          style={{ backgroundColor: address.groupColor }}
                        >
                          {address.groupIcon}
                        </div>
                        <div className="flex-1">
                          <h5 className="font-semibold text-gray-900 text-sm">{address.title}</h5>
                          <p className="text-xs text-gray-500">{address.groupName}</p>
                        </div>
                        <div className="flex items-center bg-white px-2 py-1 rounded">
                          <span className="text-xs mr-1">⭐</span>
                          <span className="text-xs font-semibold">{address.overallRating.toFixed(1)}</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2">{address.notes}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="card p-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4">最近活动</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs">📍</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">标注Vancouver City Centre</span>
                    </div>
                    <span className="badge-success">+10 积分</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs">👍</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">收到15个赞</span>
                    </div>
                    <span className="badge-success">+30 积分</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs">📍</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">标注Olympic Village</span>
                    </div>
                    <span className="badge-success">+10 积分</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;