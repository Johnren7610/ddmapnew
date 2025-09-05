import React, { useState } from 'react';

interface SimpleMapViewProps {
  onAddAnnotation?: (location: { lat: number; lng: number; address: string }) => void;
}

const SimpleMapView: React.FC<SimpleMapViewProps> = ({ onAddAnnotation }) => {
  const [zoom, setZoom] = useState(1);
  const [selectedAnnotation, setSelectedAnnotation] = useState<number | null>(null);
  const [annotations, setAnnotations] = useState([
    {
      id: 1,
      x: 300,
      y: 200,
      title: 'Vancouver Downtown',
      address: '700 W Georgia St, Vancouver',
      rating: 4.2,
      likes: 12,
      isLiked: false,
      hasTip: true,
      hasDog: false,
      notes: '市中心繁忙，停车较难，但客户通常给小费',
    },
    {
      id: 2,
      x: 450,
      y: 350,
      title: 'Olympic Village',
      address: '1625 Manitoba St, Vancouver',
      rating: 4.8,
      likes: 18,
      isLiked: true,
      hasTip: true,
      hasDog: true,
      notes: '居民区友善，有免费停车位，注意宠物较多',
    },
    {
      id: 3,
      x: 200,
      y: 400,
      title: 'Kitsilano Beach',
      address: '1305 Arbutus St, Vancouver',
      rating: 3.5,
      likes: 8,
      isLiked: false,
      hasTip: false,
      hasDog: true,
      notes: '海滩区域，夏季拥挤，停车困难',
    },
  ]);

  const handleLike = (id: number) => {
    setAnnotations(prev => prev.map(ann => {
      if (ann.id === id) {
        return {
          ...ann,
          isLiked: !ann.isLiked,
          likes: ann.isLiked ? ann.likes - 1 : ann.likes + 1
        };
      }
      return ann;
    }));
  };

  return (
    <div className="relative w-full h-full bg-gray-100 rounded-lg overflow-hidden"
         style={{
           backgroundImage: `url("data:image/svg+xml,%3Csvg width='600' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='20' height='20' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 20 0 L 0 0 0 20' fill='none' stroke='%23e5e7eb' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)'/%3E%3Cg%3E%3C!-- 海岸线 --%3E%3Cpath d='M0,350 Q150,340 300,350 T600,360 L600,400 L0,400 Z' fill='%23bfdbfe' stroke='%2393c5fd' stroke-width='2'/%3E%3C!-- 公园 --%3E%3Crect x='50' y='50' width='100' height='80' rx='10' fill='%23bbf7d0' stroke='%2386efac' stroke-width='2'/%3E%3C!-- 主要街道 --%3E%3Cpath d='M0,120 L600,120' stroke='%236b7280' stroke-width='4'/%3E%3Cpath d='M0,250 L600,250' stroke='%236b7280' stroke-width='4'/%3E%3Cpath d='M200,0 L200,400' stroke='%236b7280' stroke-width='4'/%3E%3Cpath d='M400,0 L400,400' stroke='%236b7280' stroke-width='4'/%3E%3C!-- 建筑群 --%3E%3Crect x='180' y='100' width='40' height='40' fill='%23d1d5db'/%3E%3Crect x='230' y='90' width='30' height='50' fill='%23d1d5db'/%3E%3Crect x='270' y='105' width='25' height='35' fill='%23d1d5db'/%3E%3C!-- 住宅区 --%3E%3Ccircle cx='450' cy='180' r='15' fill='%23fed7aa'/%3E%3Ccircle cx='480' cy='200' r='12' fill='%23fed7aa'/%3E%3Ccircle cx='420' cy='210' r='10' fill='%23fed7aa'/%3E%3C/g%3E%3C/svg%3E")`
         }}
      {/* 缩放控制按钮 */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2 z-20">
        <button
          onClick={() => setZoom(Math.min(zoom * 1.2, 2))}
          className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center text-gray-700 hover:bg-gray-50 font-bold text-lg"
        >
          +
        </button>
        <button
          onClick={() => setZoom(Math.max(zoom / 1.2, 0.5))}
          className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center text-gray-700 hover:bg-gray-50 font-bold text-lg"
        >
          −
        </button>
        <div className="bg-white rounded-lg shadow-lg px-2 py-1 text-xs text-center">
          {Math.round(zoom * 100)}%
        </div>
      </div>

      {/* 地图内容区域 */}
      <div 
        className="absolute inset-0 transition-transform duration-300"
        style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
      >
      {/* 地图图层叠加 */}
      <div className="absolute inset-0">
        {/* 地名标签 */}
        <div className="absolute top-16 left-16 bg-white bg-opacity-90 px-2 py-1 rounded text-xs font-semibold text-green-700 shadow">
          🌳 Stanley Park
        </div>
        
        <div className="absolute bottom-16 left-4 bg-white bg-opacity-90 px-2 py-1 rounded text-xs font-semibold text-blue-700 shadow">
          🌊 English Bay
        </div>

        <div className="absolute top-24 left-48 bg-white bg-opacity-90 px-2 py-1 rounded text-xs font-semibold text-gray-700 shadow">
          🏢 Downtown Vancouver
        </div>
        
        <div className="absolute top-48 right-32 bg-white bg-opacity-90 px-2 py-1 rounded text-xs font-semibold text-orange-700 shadow">
          🏘️ Residential Area
        </div>

        {/* 指北针 */}
        <div className="absolute top-20 right-20 bg-white bg-opacity-90 w-12 h-12 rounded-full shadow-lg flex items-center justify-center">
          <div className="text-red-500 font-bold text-lg">N</div>
          <div className="absolute top-1 text-xs text-gray-500">↑</div>
        </div>
      </div>

      {/* 城市标签 */}
      <div className="absolute top-4 left-4 bg-white rounded-lg p-3 shadow-md">
        <div className="text-sm font-bold text-gray-800">🇨🇦 温哥华</div>
        <div className="text-xs text-gray-600">Vancouver, BC</div>
      </div>

      {/* 地址标注点 */}
      {annotations.map((ann) => (
        <div key={ann.id} className="absolute" style={{ left: ann.x, top: ann.y }}>
          {/* 标记点 */}
          <div 
            className={`w-8 h-8 rounded-full border-3 border-white shadow-lg cursor-pointer transform -translate-x-4 -translate-y-4 ${
              ann.rating >= 4.5 ? 'bg-green-500' : 
              ann.rating >= 4 ? 'bg-yellow-500' : 'bg-red-500'
            } hover:scale-125 transition-all duration-200 flex items-center justify-center text-white text-xs font-bold`}
            onClick={() => setSelectedAnnotation(selectedAnnotation === ann.id ? null : ann.id)}
          >
            {ann.id}
          </div>

          {/* 点击显示的信息卡片 */}
          {selectedAnnotation === ann.id && (
            <div className="absolute left-1/2 bottom-10 transform -translate-x-1/2 z-30">
            <div className="bg-white rounded-lg shadow-xl p-4 w-64 border">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-gray-900 text-sm">{ann.title}</h3>
                <button
                  onClick={() => handleLike(ann.id)}
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                    ann.isLiked 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-gray-100 text-gray-600'
                  } hover:bg-red-200 transition-colors`}
                >
                  <span>{ann.isLiked ? '❤️' : '🤍'}</span>
                  <span>{ann.likes}</span>
                </button>
              </div>
              
              <p className="text-xs text-gray-600 mb-2">{ann.address}</p>
              
              <div className="flex flex-wrap gap-1 mb-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  ⭐ {ann.rating}
                </span>
                {ann.hasTip && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                    💰 有小费
                  </span>
                )}
                {ann.hasDog && (
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">
                    🐕 有狗
                  </span>
                )}
              </div>
              
              <p className="text-xs text-gray-600 mb-2 italic">"{ann.notes}"</p>
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">点击其他地点或再次点击关闭</span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedAnnotation(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 text-sm"
                >
                  ✕
                </button>
              </div>
              
              {/* 小箭头 */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                <div className="w-3 h-3 bg-white border-r border-b transform rotate-45 -mt-1.5"></div>
              </div>
            </div>
            </div>
          )}
        </div>
      ))}
      </div>

      {/* 比例尺 */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg p-2 shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-12 h-0.5 bg-gray-600"></div>
          <span className="text-xs text-gray-600">1km</span>
        </div>
      </div>

      {/* 图例 */}
      <div className="absolute bottom-4 right-4 bg-white rounded-lg p-3 shadow-md">
        <h4 className="font-semibold text-xs text-gray-900 mb-2">评分图例</h4>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-xs text-gray-600">优秀 (4.5+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-xs text-gray-600">良好 (4-4.5)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-xs text-gray-600">较差 (&lt;4)</span>
          </div>
        </div>
      </div>

      {/* 中心点 */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-2 h-2 bg-red-600 rounded-full shadow-lg"></div>
      </div>
    </div>
  );
};

export default SimpleMapView;