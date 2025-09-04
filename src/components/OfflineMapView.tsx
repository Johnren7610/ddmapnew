import React, { useState } from 'react';

interface OfflineMapViewProps {
  onAddAnnotation?: (location: { lat: number; lng: number; address: string }) => void;
}

const OfflineMapView: React.FC<OfflineMapViewProps> = ({ onAddAnnotation }) => {
  const [isAddingMarker, setIsAddingMarker] = useState(false);

  // 温哥华示例标注数据
  const [sampleAnnotations, setSampleAnnotations] = useState([
    {
      id: 1,
      lat: 49.2827,
      lng: -123.1207,
      title: 'Vancouver City Centre',
      address: '700 W Georgia St, Vancouver, BC V7Y 1A2',
      rating: 4.2,
      parkingRating: 3,
      hasDog: false,
      hasTip: true,
      notes: '市中心繁忙，建议避开高峰时段，地下停车收费较贵',
      likes: 12,
      isLiked: false,
      author: '司机小王'
    },
    {
      id: 2,
      lat: 49.2606,
      lng: -123.1136,
      title: 'Olympic Village',
      address: '1625 Manitoba St, Vancouver, BC V5Y 0A5',
      rating: 4.8,
      parkingRating: 4,
      hasDog: true,
      hasTip: true,
      notes: '居民区友善，有免费路边停车位，注意宠物较多',
      likes: 18,
      isLiked: true,
      author: '老司机陈师傅'
    }
  ]);

  // 处理点赞功能
  const handleLikeAnnotation = (annotationId: number) => {
    setSampleAnnotations(prev => prev.map(annotation => {
      if (annotation.id === annotationId) {
        const newIsLiked = !annotation.isLiked;
        const newLikes = newIsLiked ? annotation.likes + 1 : annotation.likes - 1;
        
        // 显示点赞反馈
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = `
          <div style="position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background: ${newIsLiked ? '#22c55e' : '#6b7280'}; color: white; padding: 8px 16px; border-radius: 20px; z-index: 9999; font-family: Inter, sans-serif; font-size: 14px; display: flex; align-items: center; gap: 6px; animation: slideDown 0.3s ease-out;">
            <span>${newIsLiked ? '👍' : '👎'}</span>
            <span>${newIsLiked ? '已点赞' : '取消点赞'}</span>
          </div>
        `;
        document.body.appendChild(tempDiv);
        
        setTimeout(() => {
          if (document.body.contains(tempDiv)) {
            document.body.removeChild(tempDiv);
          }
        }, 2000);
        
        return {
          ...annotation,
          isLiked: newIsLiked,
          likes: newLikes
        };
      }
      return annotation;
    }));
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isAddingMarker) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // 模拟坐标转换 (这是简化版本)
    const lat = 49.2827 + (y - 300) * -0.001;
    const lng = -123.1207 + (x - 300) * 0.001;
    const address = `Vancouver, BC - 纬度: ${lat.toFixed(6)}, 经度: ${lng.toFixed(6)}`;
    
    if (onAddAnnotation) {
      onAddAnnotation({ lat, lng, address });
    }
    
    setIsAddingMarker(false);
  };

  const getMarkerPosition = (lat: number, lng: number) => {
    // 简单的坐标转换到像素位置
    const centerLat = 49.2827;
    const centerLng = -123.1207;
    
    const x = 300 + (lng - centerLng) * 1000;
    const y = 300 + (centerLat - lat) * 1000;
    
    return { x, y };
  };

  return (
    <div className="relative h-full bg-gradient-to-br from-blue-100 via-green-100 to-blue-200 rounded-xl overflow-hidden">
      {/* 地图背景 - 模拟温哥华地图 */}
      <div 
        className="w-full h-full relative cursor-pointer"
        onClick={handleMapClick}
        style={{
          backgroundImage: `
            radial-gradient(circle at 30% 30%, rgba(34, 197, 94, 0.2) 0%, transparent 50%),
            radial-gradient(circle at 70% 60%, rgba(59, 130, 246, 0.2) 0%, transparent 50%),
            radial-gradient(circle at 50% 80%, rgba(168, 85, 247, 0.1) 0%, transparent 50%),
            linear-gradient(45deg, transparent 49%, rgba(255,255,255,0.1) 49.5%, rgba(255,255,255,0.1) 50.5%, transparent 51%),
            linear-gradient(-45deg, transparent 49%, rgba(255,255,255,0.1) 49.5%, rgba(255,255,255,0.1) 50.5%, transparent 51%)
          `,
          backgroundSize: '100% 100%, 100% 100%, 100% 100%, 60px 60px, 60px 60px'
        }}
      >
        {/* 模拟街道网格 */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(rgba(107, 114, 128, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(107, 114, 128, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        {/* 温哥华地标标识 */}
        <div className="absolute top-4 left-4 bg-white bg-opacity-90 rounded-lg p-3 shadow-lg">
          <div className="text-sm font-bold text-gray-900 mb-1">🇨🇦 Vancouver, BC</div>
          <div className="text-xs text-gray-600">加拿大温哥华</div>
        </div>

        {/* 比例尺 */}
        <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 rounded-lg p-2 shadow-lg">
          <div className="flex items-center space-x-2">
            <div className="w-16 h-0.5 bg-gray-600"></div>
            <span className="text-xs text-gray-600">1km</span>
          </div>
        </div>

        {/* 标注点 */}
        {sampleAnnotations.map((annotation) => {
          const position = getMarkerPosition(annotation.lat, annotation.lng);
          return (
            <div
              key={annotation.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              style={{ left: position.x, top: position.y }}
            >
              {/* 标记点 */}
              <div
                className={`w-6 h-6 rounded-full border-2 border-white shadow-lg ${
                  annotation.rating >= 4.5 ? 'bg-green-500' : 
                  annotation.rating >= 4 ? 'bg-green-400' : 
                  annotation.rating >= 3 ? 'bg-yellow-500' : 'bg-red-500'
                } hover:scale-125 transition-transform`}
              ></div>

              {/* 悬停信息卡 */}
              <div className="absolute left-1/2 bottom-8 transform -translate-x-1/2 hidden group-hover:block z-10">
                <div className="bg-white rounded-lg shadow-xl p-4 w-64 border">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900">{annotation.title}</h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLikeAnnotation(annotation.id);
                      }}
                      className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-all ${
                        annotation.isLiked 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <span>{annotation.isLiked ? '👍' : '🤍'}</span>
                      <span>{annotation.likes}</span>
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{annotation.address}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      annotation.parkingRating >= 4 ? 'bg-green-100 text-green-800' :
                      annotation.parkingRating >= 3 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      停车: {annotation.parkingRating}/5
                    </span>
                    {annotation.hasDog && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        有狗
                      </span>
                    )}
                    {annotation.hasTip && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        有小费
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{annotation.notes}</p>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>by {annotation.author}</span>
                    <span>⭐ {annotation.rating.toFixed(1)}</span>
                  </div>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                    <div className="w-3 h-3 bg-white border-r border-b transform rotate-45"></div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* 中心标识 */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-4 h-4 border-2 border-gray-600 rounded-full bg-white shadow-lg"></div>
        </div>
      </div>

      {/* 地图控制按钮 */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2">
        <button
          onClick={() => setIsAddingMarker(!isAddingMarker)}
          className={`px-4 py-2 rounded-full font-medium text-sm shadow-lg transition-all ${
            isAddingMarker
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          {isAddingMarker ? '点击地图添加标注' : '+ 添加标注'}
        </button>
        
        <div className="flex flex-col space-y-1">
          <button className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center text-gray-600 hover:bg-gray-50">
            +
          </button>
          <button className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center text-gray-600 hover:bg-gray-50">
            −
          </button>
        </div>
      </div>

      {/* 图例和点赞排行 */}
      <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-3 text-xs">
        <div className="mb-3">
          <h4 className="font-semibold text-gray-900 mb-2">评分图例</h4>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-gray-600">优秀 (4.5+)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <span className="text-gray-600">良好 (4-4.5)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-gray-600">一般 (3-4)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-gray-600">较差 (&lt;3)</span>
            </div>
          </div>
        </div>
        
        {/* 点赞排行榜 */}
        <div className="border-t border-gray-200 pt-3 mb-3">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-1">
            <span>👍</span>
            <span>热门标注</span>
          </h4>
          <div className="space-y-1">
            {[...sampleAnnotations]
              .sort((a, b) => b.likes - a.likes)
              .map((annotation, index) => (
                <div key={annotation.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1">
                    <span className={`font-bold ${
                      index === 0 ? 'text-yellow-600' : 'text-gray-600'
                    }`}>
                      {index === 0 ? '🥇' : '🥈'}
                    </span>
                    <span className="text-gray-700 truncate max-w-20" title={annotation.title}>
                      {annotation.title.length > 8 ? annotation.title.substring(0, 8) + '...' : annotation.title}
                    </span>
                  </div>
                  <span className="text-gray-500 font-medium">{annotation.likes}👍</span>
                </div>
              ))
            }
          </div>
        </div>
        
        <div className="pt-3 border-t border-gray-200">
          <p className="text-gray-500 text-xs">离线地图视图</p>
        </div>
      </div>

      {/* 添加标注提示 */}
      {isAddingMarker && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="bg-black bg-opacity-75 text-white px-4 py-2 rounded-lg text-sm">
            点击地图任意位置添加标注
          </div>
        </div>
      )}
    </div>
  );
};

export default OfflineMapView;