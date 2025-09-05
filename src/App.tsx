import React, { useState } from 'react'
import SimpleMapView from './components/SimpleMapView'
import './App.css'

function App() {
  const [showMap, setShowMap] = useState(false);
  return (
    <div className="App">
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-green-600">🚚 DDmap</h1>
                <span className="ml-3 text-sm text-gray-600 bg-green-100 px-2 py-1 rounded-full">
                  司机专用点评平台
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">v1.0.0</span>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" title="服务正常"></div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">欢迎使用 DDmap</h2>
              <p className="text-lg text-gray-600 mb-8">司机专用地址点评平台</p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">🚀 网站正在配置中</h3>
                <p className="text-blue-700">
                  我们正在完成最后的配置步骤，请稍候片刻。完整功能包括：
                </p>
                <ul className="mt-4 text-left text-blue-700 space-y-2">
                  <li>• 📍 实时地图和地址搜索</li>
                  <li>• 👥 用户登录和注册系统</li>
                  <li>• 💎 会员订阅和高级功能</li>
                  <li>• 📝 地址黑名单管理</li>
                  <li>• 🎯 附近零小费地址提醒</li>
                  <li>• 📱 移动端优化界面</li>
                </ul>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="text-2xl mb-3">🚛</div>
                  <h3 className="font-semibold text-gray-900 mb-2">专为司机设计</h3>
                  <p className="text-gray-600 text-sm">针对送货司机的实际需求，提供最实用的地址评价功能</p>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="text-2xl mb-3">💡</div>
                  <h3 className="font-semibold text-gray-900 mb-2">智能提醒</h3>
                  <p className="text-gray-600 text-sm">自动识别问题地址，提前预警，避免不必要的麻烦</p>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="text-2xl mb-3">🤝</div>
                  <h3 className="font-semibold text-gray-900 mb-2">司机互助</h3>
                  <p className="text-gray-600 text-sm">司机之间分享经验，共同建设更好的送货环境</p>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-sm">
                  <strong>环境变量:</strong> {import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? '✅ 已配置' : '❌ 未配置'}
                </p>
              </div>
              
              <div className="mt-8">
                <button 
                  onClick={() => setShowMap(true)}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  🚀 启动地图功能
                </button>
              </div>
              
              {showMap && (
                <div className="mt-8">
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden" style={{ height: '600px' }}>
                    <div className="flex items-center justify-between p-4 border-b">
                      <h3 className="text-lg font-semibold">DDmap 演示版</h3>
                      <button 
                        onClick={() => setShowMap(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        ✕
                      </button>
                    </div>
                    <div style={{ height: '500px' }}>
                      <SimpleMapView 
                        onAddAnnotation={(location) => {
                          console.log('新增地址标注:', location);
                        }} 
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        <footer className="bg-white border-t border-gray-200 mt-8">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <span>© 2024 DDmap - 司机专用地址点评平台</span>
                <a 
                  href="https://github.com/Johnren7610/ddmapnew" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-green-600 transition-colors"
                >
                  GitHub
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <span>Made with</span>
                <span className="text-red-500">❤️</span>
                <span>for delivery drivers</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default App