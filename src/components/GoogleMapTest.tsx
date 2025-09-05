import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    google: any;
  }
}

const GoogleMapTest: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initMap = () => {
      console.log('Trying to initialize Google Maps...');
      console.log('Google Maps API available:', !!window.google);
      console.log('Map container element:', mapRef.current);

      if (!window.google) {
        console.log('Google Maps API not loaded, retrying in 1 second...');
        setTimeout(initMap, 1000);
        return;
      }

      if (!mapRef.current) {
        console.log('Map container not found, retrying...');
        setTimeout(initMap, 500);
        return;
      }

      try {
        console.log('Creating Google Maps instance...');
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: 49.2827, lng: -123.1207 }, // Vancouver
          zoom: 12,
          mapTypeId: 'roadmap'
        });

        console.log('Google Maps created successfully!', map);

        // 添加一个测试标记
        const marker = new window.google.maps.Marker({
          position: { lat: 49.2827, lng: -123.1207 },
          map: map,
          title: 'Vancouver Test Marker'
        });

        console.log('Test marker added!', marker);

      } catch (error) {
        console.error('Error creating Google Maps:', error);
      }
    };

    // 立即尝试初始化
    initMap();
  }, []);

  return (
    <div className="w-full h-full">
      <div className="bg-blue-50 border border-blue-200 p-3 mb-4 rounded">
        <h3 className="text-blue-800 font-semibold mb-2">🧪 Google Maps 测试</h3>
        <div className="text-sm text-blue-700 space-y-1">
          <div>API密钥: {import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? '✅ 已配置' : '❌ 未配置'}</div>
          <div>Google API: {typeof window !== 'undefined' && window.google ? '✅ 已加载' : '⏳ 加载中...'}</div>
        </div>
        <p className="text-xs text-blue-600 mt-2">
          请打开浏览器开发者工具查看控制台日志以了解加载状态
        </p>
      </div>
      
      <div 
        ref={mapRef} 
        className="w-full bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center"
        style={{ height: '400px' }}
      >
        <div className="text-gray-500 text-center">
          <div className="text-4xl mb-2">🗺️</div>
          <div>Google Maps 加载中...</div>
          <div className="text-sm mt-1">如果长时间显示此消息，请检查API密钥配置</div>
        </div>
      </div>
    </div>
  );
};

export default GoogleMapTest;