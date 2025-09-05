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
    <div className="relative w-full h-full bg-gradient-to-br from-blue-100 to-green-100 rounded-lg overflow-hidden">
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
      {/* 地图背景网格 - 街道 */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(rgba(107, 114, 128, 0.6) 2px, transparent 2px),
            linear-gradient(90deg, rgba(107, 114, 128, 0.6) 2px, transparent 2px),
            linear-gradient(rgba(156, 163, 175, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(156, 163, 175, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '120px 120px, 120px 120px, 30px 30px, 30px 30px'
        }}
      ></div>

      {/* 模拟街道和地标 */}
      <div className="absolute inset-0">
        {/* 主要街道 */}
        <div className="absolute top-1/3 left-0 w-full h-1 bg-gray-400 opacity-60"></div>
        <div className="absolute top-2/3 left-0 w-full h-1 bg-gray-400 opacity-60"></div>
        <div className="absolute top-0 left-1/3 w-1 h-full bg-gray-400 opacity-60"></div>
        <div className="absolute top-0 left-2/3 w-1 h-full bg-gray-400 opacity-60"></div>

        {/* 公园区域 */}
        <div className="absolute top-16 left-16 w-20 h-20 bg-green-200 rounded-lg opacity-50">
          <div className="text-xs text-green-700 p-1 font-semibold">🌳 Park</div>
        </div>
        
        {/* 海岸线 */}
        <div className="absolute bottom-0 left-0 w-full h-12 bg-blue-200 opacity-50">
          <div className="text-xs text-blue-700 p-1">🌊 English Bay</div>
        </div>

        {/* 建筑群 */}
        <div className="absolute top-32 left-64 w-16 h-16 bg-gray-300 rounded opacity-40">
          <div className="text-xs text-gray-600 p-1">🏢 Downtown</div>
        </div>
        
        <div className="absolute top-80 left-96 w-12 h-12 bg-orange-200 rounded opacity-40">
          <div className="text-xs text-orange-600 p-1">🏘️</div>
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