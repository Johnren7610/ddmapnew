import React, { useState } from 'react';

interface SimpleMapViewProps {
  onAddAnnotation?: (location: { lat: number; lng: number; address: string }) => void;
}

const SimpleMapView: React.FC<SimpleMapViewProps> = ({ onAddAnnotation }) => {
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
      {/* 地图背景网格 */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px'
        }}
      ></div>

      {/* 城市标签 */}
      <div className="absolute top-4 left-4 bg-white rounded-lg p-3 shadow-md">
        <div className="text-sm font-bold text-gray-800">🇨🇦 温哥华</div>
        <div className="text-xs text-gray-600">Vancouver, BC</div>
      </div>

      {/* 地址标注点 */}
      {annotations.map((ann) => (
        <div key={ann.id} className="absolute group" style={{ left: ann.x, top: ann.y }}>
          {/* 标记点 */}
          <div className={`w-6 h-6 rounded-full border-2 border-white shadow-lg cursor-pointer transform -translate-x-3 -translate-y-3 ${
            ann.rating >= 4.5 ? 'bg-green-500' : 
            ann.rating >= 4 ? 'bg-yellow-500' : 'bg-red-500'
          } hover:scale-125 transition-transform`}>
          </div>

          {/* 信息卡片 */}
          <div className="absolute left-1/2 bottom-8 transform -translate-x-1/2 hidden group-hover:block z-10">
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
              
              <div className="text-xs text-gray-500">
                点击标记点查看详情
              </div>
              
              {/* 小箭头 */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                <div className="w-3 h-3 bg-white border-r border-b transform rotate-45 -mt-1.5"></div>
              </div>
            </div>
          </div>
        </div>
      ))}

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