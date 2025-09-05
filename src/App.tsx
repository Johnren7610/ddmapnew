import React from 'react'
import MapView from './components/MapView'
import OfflineMapView from './components/OfflineMapView'
import './App.css'

function App() {
  // 检查Google Maps API密钥是否可用
  const hasApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  
  return (
    <div className="App">
      {hasApiKey ? (
        <MapView />
      ) : (
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
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" title="正在配置..."></div>
                </div>
              </div>
            </div>
          </header>

          <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
              <OfflineMapView 
                onAddAnnotation={(location) => {
                  console.log('新增地址标注:', location);
                }} 
              />
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
      )}
    </div>
  )
}

export default App