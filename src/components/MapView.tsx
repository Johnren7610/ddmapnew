import React, { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    google: any;
  }
}

interface MapViewProps {
  onAddAnnotation?: (location: { lat: number; lng: number; address: string }) => void;
}

const MapView: React.FC<MapViewProps> = ({ onAddAnnotation }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [map, setMap] = useState<any>(null);
  const [isAddingMarker, setIsAddingMarker] = useState(false);
  const [clickListener, setClickListener] = useState<any>(null);
  const [searchValue, setSearchValue] = useState('');
  const [autocomplete, setAutocomplete] = useState<any>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([
    'Tim Hortons Vancouver',
    'McDonald\'s Downtown Vancouver',
    'Stanley Park Vancouver'
  ]);
  const [showAddAnnotationModal, setShowAddAnnotationModal] = useState(false);
  const [pendingLocation, setPendingLocation] = useState<{lat: number; lng: number; address: string} | null>(null);
  const [hoverTooltip, setHoverTooltip] = useState<any>(null);
  const [showFavoriteModal, setShowFavoriteModal] = useState(false);
  const [currentAnnotationToFavorite, setCurrentAnnotationToFavorite] = useState<any>(null);
  const [favoriteGroups, setFavoriteGroups] = useState([
    { id: 1, name: '小费好顾客', color: '#22c55e', icon: '💰', count: 0 },
    { id: 2, name: '零小费黑名单', color: '#ef4444', icon: '⚠️', count: 0 },
    { id: 3, name: '停车便利', color: '#3b82f6', icon: '🚗', count: 0 },
    { id: 4, name: '友善客户', color: '#8b5cf6', icon: '😊', count: 0 }
  ]);
  const [showGroupManager, setShowGroupManager] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedGroupIcon, setSelectedGroupIcon] = useState('📁');
  const [selectedGroupColor, setSelectedGroupColor] = useState('#6b7280');
  const [showAllReviewsModal, setShowAllReviewsModal] = useState(false);
  const [currentAnnotationForReviews, setCurrentAnnotationForReviews] = useState<any>(null);
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);
  const [currentAnnotationForNewReview, setCurrentAnnotationForNewReview] = useState<any>(null);
  
  // 会员系统状态
  const [membershipStatus, setMembershipStatus] = useState({
    isPremium: false, // 是否为会员
    subscribedDate: null as string | null,
    expiryDate: null as string | null,
    plan: 'free' as 'free' | 'monthly' | 'yearly'
  });
  const [showMembershipModal, setShowMembershipModal] = useState(false);
  const [showNearbyBlacklistModal, setShowNearbyBlacklistModal] = useState(false);
  const [nearbyRadius, setNearbyRadius] = useState(5); // 默认5公里
  const [blacklistAddresses, setBlacklistAddresses] = useState<any[]>([]); // 用户的黑名单地址
  const [annotationForm, setAnnotationForm] = useState({
    parkingRating: 5,
    hasDog: false,
    tipRating: 5,
    noTip: false,
    overallRating: 5,
    notes: '',
    title: ''
  });

  // 示例标注数据 - 温哥华地区 (更新为支持多评价结构)
  const [sampleAnnotations, setSampleAnnotations] = useState([
    {
      id: 1,
      lat: 49.2827,
      lng: -123.1207,
      title: '高档公寓楼',
      address: '700 W Georgia St, Vancouver, BC V7Y 1A2',
      overallRating: 4.2,
      parkingRating: 2,
      tipRating: 5,
      hasDog: false,
      noTip: false,
      notes: '市中心高档公寓，停车困难但小费大方，门卫友善',
      reviews: 12,
      createdAt: '3天前',
      likes: 15,
      isLiked: false,
      author: '司机小李',
      allReviews: [
        {
          id: 101,
          author: '司机小李',
          overallRating: 4.5,
          parkingRating: 2,
          tipRating: 5,
          hasDog: false,
          noTip: false,
          notes: '市中心高档公寓，停车困难但小费大方，门卫友善',
          createdAt: '3天前',
          likes: 8,
          isLiked: false
        },
        {
          id: 102,
          author: '老司机陈师傅',
          overallRating: 3.8,
          parkingRating: 2,
          tipRating: 4,
          hasDog: false,
          noTip: false,
          notes: '确实停车困难，但客户态度不错，小费也给得挺好',
          createdAt: '1天前',
          likes: 4,
          isLiked: true
        },
        {
          id: 103,
          author: '新手司机小刘',
          overallRating: 4.3,
          parkingRating: 1,
          tipRating: 5,
          hasDog: false,
          noTip: false,
          notes: '第一次来这里配送，停车真的很难找位置，不过小费给得很大方！',
          createdAt: '6小时前',
          likes: 3,
          isLiked: false
        }
      ]
    },
    {
      id: 2,
      lat: 49.2606,
      lng: -123.1136,
      title: '联排别墅区',
      address: '1625 Manitoba St, Vancouver, BC V5Y 0A5',
      overallRating: 2.1,
      parkingRating: 5,
      tipRating: 1,
      hasDog: true,
      noTip: true,
      notes: '停车很便利但零小费！有大型犬需注意安全，客户态度一般',
      reviews: 8,
      createdAt: '1周前',
      likes: 22,
      isLiked: true,
      author: '司机小张',
      allReviews: [
        {
          id: 201,
          author: '司机小张',
          overallRating: 1.5,
          parkingRating: 5,
          tipRating: 1,
          hasDog: true,
          noTip: true,
          notes: '停车很便利但零小费！有大型犬需注意安全，客户态度一般',
          createdAt: '1周前',
          likes: 12,
          isLiked: false
        },
        {
          id: 202,
          author: '资深司机王师傅',
          overallRating: 2.7,
          parkingRating: 5,
          tipRating: 1,
          hasDog: true,
          noTip: true,
          notes: '同意楼上，零小费确实很过分，狗确实很大只，要小心',
          createdAt: '5天前',
          likes: 10,
          isLiked: true
        }
      ]
    },
    {
      id: 3,
      lat: 49.2845,
      lng: -123.1089,
      title: '商务办公楼',
      address: '1055 W Hastings St, Vancouver, BC V6E 2E9',
      overallRating: 4.8,
      parkingRating: 4,
      tipRating: 4,
      hasDog: false,
      noTip: false,
      notes: 'CBD核心区域，有地下停车场，客户都很专业礼貌，推荐！',
      reviews: 25,
      createdAt: '5天前',
      likes: 38,
      isLiked: false,
      author: '资深司机王师傅',
      allReviews: [
        {
          id: 301,
          author: '资深司机王师傅',
          overallRating: 4.8,
          parkingRating: 4,
          tipRating: 4,
          hasDog: false,
          noTip: false,
          notes: 'CBD核心区域，有地下停车场，客户都很专业礼貌，推荐！',
          createdAt: '5天前',
          likes: 20,
          isLiked: false
        },
        {
          id: 302,
          author: '司机小李',
          overallRating: 4.7,
          parkingRating: 4,
          tipRating: 4,
          hasDog: false,
          noTip: false,
          notes: '确实是个好地方，写字楼的客户都比较有素质，推荐新手司机来',
          createdAt: '2天前',
          likes: 15,
          isLiked: true
        },
        {
          id: 303,
          author: '夜班司机小赵',
          overallRating: 5.0,
          parkingRating: 5,
          tipRating: 4,
          hasDog: false,
          noTip: false,
          notes: '晚上来这里配送很不错，停车位充足，保安也很友善',
          createdAt: '18小时前',
          likes: 3,
          isLiked: false
        }
      ]
    }
  ]);

  // 点击外部关闭建议
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // ESC键关闭弹窗
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        // 按优先级关闭弹窗
        if (showAddReviewModal) {
          setShowAddReviewModal(false);
          setCurrentAnnotationForNewReview(null);
          setAnnotationForm({
            parkingRating: 5,
            hasDog: false,
            tipRating: 5,
            noTip: false,
            overallRating: 5,
            notes: '',
            title: ''
          });
        } else if (showAllReviewsModal) {
          setShowAllReviewsModal(false);
          setCurrentAnnotationForReviews(null);
        } else if (showAddAnnotationModal) {
          setShowAddAnnotationModal(false);
          setPendingLocation(null);
          setAnnotationForm({
            parkingRating: 5,
            hasDog: false,
            tipRating: 5,
            noTip: false,
            overallRating: 5,
            notes: '',
            title: ''
          });
        } else if (showFavoriteModal) {
          setShowFavoriteModal(false);
          setCurrentAnnotationToFavorite(null);
        } else if (showGroupManager) {
          setShowGroupManager(false);
        } else if (showMembershipModal) {
          setShowMembershipModal(false);
        } else if (showNearbyBlacklistModal) {
          setShowNearbyBlacklistModal(false);
        } else if (window.currentDetailInfoWindow) {
          // 关闭Google Maps InfoWindow
          window.currentDetailInfoWindow.close();
          window.currentDetailInfoWindow = null;
        }
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [showAddReviewModal, showAllReviewsModal, showAddAnnotationModal, showFavoriteModal, showGroupManager, showMembershipModal, showNearbyBlacklistModal]);

  // 反向地理编码获取地址
  const getAddressFromCoordinates = async (lat: number, lng: number): Promise<string> => {
    return new Promise((resolve) => {
      if (!window.google || !window.google.maps.Geocoder) {
        resolve(`Vancouver, BC - 纬度: ${lat.toFixed(6)}, 经度: ${lng.toFixed(6)}`);
        return;
      }

      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode(
        { location: { lat, lng } },
        (results: any[], status: string) => {
          if (status === 'OK' && results && results[0]) {
            resolve(results[0].formatted_address);
          } else {
            resolve(`Vancouver, BC - 纬度: ${lat.toFixed(6)}, 经度: ${lng.toFixed(6)}`);
          }
        }
      );
    });
  };

  useEffect(() => {
    const initMap = () => {
      if (!window.google || !mapRef.current) {
        // 如果Google Maps API还没加载，延迟重试
        setTimeout(initMap, 500);
        return;
      }

      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: { lat: 49.2827, lng: -123.1207 }, // Vancouver, BC
        zoom: 13,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels.text',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });

      // 添加示例标记
      sampleAnnotations.forEach(annotation => {
        // 根据总体评分确定标记颜色
        const markerColor = annotation.overallRating >= 4.5 ? '#22c55e' : 
                           annotation.overallRating >= 3.5 ? '#eab308' : 
                           annotation.overallRating >= 2.5 ? '#f97316' : '#ef4444';

        // 创建文字标签显示评分
        const marker = new window.google.maps.Marker({
          position: { lat: annotation.lat, lng: annotation.lng },
          map: mapInstance,
          title: annotation.title,
          label: {
            text: annotation.overallRating.toFixed(1),
            color: '#FFFFFF',
            fontSize: '11px',
            fontWeight: 'bold',
            fontFamily: 'Inter, sans-serif'
          },
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 12,
            fillColor: markerColor,
            fillOpacity: 0.9,
            strokeWeight: 2,
            strokeColor: '#FFFFFF'
          }
        });

        // 创建简洁的悬停提示框
        const hoverTooltipContent = `
          <div style="padding: 8px 12px; font-family: Inter, sans-serif; background: rgba(0,0,0,0.8); color: white; border-radius: 8px; max-width: 220px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
              <span style="font-weight: 600; font-size: 13px;">${annotation.title}</span>
              <div style="display: flex; align-items: center; gap: 4px;">
                <button onclick="window.favoriteAnnotationQuick(${annotation.id})" style="background: rgba(255,255,255,0.2); border: none; padding: 3px 4px; border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; color: white;" onmouseover="this.style.background='rgba(255,255,255,0.4)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">
                  <span style="font-size: 11px;">📁</span>
                </button>
                <button onclick="window.likeAnnotation(${annotation.id})" style="background: rgba(255,255,255,0.2); border: none; padding: 3px 6px; border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; color: white; gap: 2px;" onmouseover="this.style.background='rgba(255,255,255,0.4)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">
                  <span style="font-size: 11px;">${annotation.isLiked ? '👍' : '🤍'}</span>
                  <span style="font-size: 10px; font-weight: 600;">${annotation.likes}</span>
                </button>
                <div style="display: flex; align-items: center; background-color: rgba(255,255,255,0.2); padding: 2px 6px; border-radius: 4px;">
                  <span style="font-size: 12px; margin-right: 2px;">⭐</span>
                  <span style="font-size: 12px; font-weight: 600;">${annotation.overallRating.toFixed(1)}</span>
                </div>
              </div>
            </div>
            <div style="font-size: 11px; opacity: 0.9; margin-bottom: 4px;">${annotation.reviews} 条评价 • ${annotation.createdAt}</div>
            <div style="display: flex; gap: 4px; flex-wrap: wrap; margin-bottom: 4px;">
              ${annotation.hasDog ? '<span style="background: #ef4444; padding: 1px 4px; border-radius: 4px; font-size: 10px;">🐕</span>' : ''}
              ${annotation.noTip ? '<span style="background: #ef4444; padding: 1px 4px; border-radius: 4px; font-size: 10px;">⚠️零小费</span>' : ''}
              ${annotation.parkingRating <= 2 ? '<span style="background: #f97316; padding: 1px 4px; border-radius: 4px; font-size: 10px;">🚗难停车</span>' : ''}
              ${annotation.tipRating >= 4 ? '<span style="background: #22c55e; padding: 1px 4px; border-radius: 4px; font-size: 10px;">💰好小费</span>' : ''}
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 10px; opacity: 0.7;">
              <span>点击查看详细评价</span>
              <span>📁 快速收藏</span>
            </div>
          </div>
        `;

        const hoverTooltip = new window.google.maps.InfoWindow({
          content: hoverTooltipContent,
          disableAutoPan: true,
          maxWidth: 250
        });

        // 创建详细的信息窗口
        const parkingText = annotation.parkingRating >= 4 ? '停车便利' : annotation.parkingRating >= 3 ? '停车一般' : '停车困难';
        const tipText = annotation.noTip ? '无小费!' : annotation.tipRating >= 4 ? '小费大方' : annotation.tipRating >= 3 ? '小费一般' : '小费较少';

        const detailInfoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 16px; max-width: 350px; font-family: Inter, sans-serif; position: relative;">
              <!-- 关闭按钮 -->
              <button onclick="window.closeInfoWindow()" style="position: absolute; top: 8px; right: 8px; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; border-radius: 50%; background: #f3f4f6; border: none; cursor: pointer; color: #6b7280; transition: all 0.2s; z-index: 10;" onmouseover="this.style.background='#e5e7eb'; this.style.color='#374151';" onmouseout="this.style.background='#f3f4f6'; this.style.color='#6b7280';">
                <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div style="display: flex; justify-content: space-between; align-items-start; margin-bottom: 12px; padding-right: 30px;">
                <h3 style="font-weight: 600; color: #111827; font-size: 16px; margin: 0; line-height: 1.2;">${annotation.title}</h3>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <button onclick="window.favoriteAnnotation(${annotation.id})" style="background: #f3f4f6; border: none; padding: 6px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s;">
                    <span style="font-size: 14px;">⭐</span>
                  </button>
                  <div style="display: flex; align-items: center; background-color: #f3f4f6; padding: 6px 10px; border-radius: 8px; flex-shrink: 0;">
                    <span style="font-size: 16px; margin-right: 4px;">⭐</span>
                    <span style="font-size: 14px; font-weight: 600; color: #111827;">${annotation.overallRating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
              
              <p style="font-size: 12px; color: #6b7280; margin-bottom: 14px; line-height: 1.4;">${annotation.address}</p>
              
              <div style="display: flex; gap: 6px; margin-bottom: 14px; flex-wrap: wrap;">
                <span style="display: inline-flex; align-items: center; padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: 500; ${
                  annotation.parkingRating >= 4 ? 'background-color: #dcfce7; color: #166534;' : 
                  annotation.parkingRating >= 3 ? 'background-color: #fef3c7; color: #92400e;' : 'background-color: #fecaca; color: #991b1b;'
                }">
                  🚗 ${parkingText}
                </span>
                ${annotation.hasDog ? '<span style="display: inline-flex; align-items: center; padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: 500; background-color: #fecaca; color: #991b1b;">🐕 有恶犬</span>' : ''}
                <span style="display: inline-flex; align-items: center; padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: 500; ${
                  annotation.noTip ? 'background-color: #fecaca; color: #991b1b;' :
                  annotation.tipRating >= 4 ? 'background-color: #dcfce7; color: #166534;' : 
                  annotation.tipRating >= 3 ? 'background-color: #fef3c7; color: #92400e;' : 'background-color: #fed7aa; color: #9a3412;'
                }">
                  💰 ${tipText}
                </span>
              </div>
              
              <div style="background-color: #f9fafb; padding: 12px; border-radius: 8px; margin-bottom: 12px;">
                <p style="font-size: 12px; color: #6b7280; margin: 0; line-height: 1.5;">💭 ${annotation.notes}</p>
              </div>
              
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-top: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb; margin-bottom: 8px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="font-size: 11px; color: #9ca3af; font-weight: 500;">${annotation.allReviews.length} 条评价</span>
                  <button onclick="window.likeAnnotation(${annotation.id})" style="background: none; border: none; padding: 2px 6px; border-radius: 4px; cursor: pointer; display: flex; align-items: center; gap: 3px; transition: all 0.2s; ${annotation.isLiked ? 'background: #dcfce7; color: #166534;' : 'color: #9ca3af; hover:background: #f3f4f6;'}" onmouseover="this.style.background=this.style.background || '#f3f4f6'" onmouseout="this.style.background='${annotation.isLiked ? '#dcfce7' : 'none'}'">
                    <span style="font-size: 12px;">${annotation.isLiked ? '👍' : '🤍'}</span>
                    <span style="font-size: 11px; font-weight: 500;">${annotation.likes}</span>
                  </button>
                </div>
                <div style="display: flex; flex-direction: column; align-items: end; gap: 2px;">
                  <span style="font-size: 11px; color: #9ca3af;">${annotation.createdAt}</span>
                  <span style="font-size: 10px; color: #9ca3af;">by ${annotation.author}</span>
                </div>
              </div>
              
              <div style="display: flex; gap: 6px; margin-bottom: 12px;">
                <button onclick="window.showAllReviews(${annotation.id})" style="flex: 1; background: #3b82f6; color: white; border: none; padding: 8px 12px; border-radius: 6px; font-size: 12px; font-weight: 500; cursor: pointer; transition: all 0.2s;">
                  📋 查看所有评价
                </button>
                <button onclick="window.addNewReview(${annotation.id})" style="flex: 1; background: #22c55e; color: white; border: none; padding: 8px 12px; border-radius: 6px; font-size: 12px; font-weight: 500; cursor: pointer; transition: all 0.2s;">
                  ✍️ 添加评价
                </button>
              </div>
              
              ${annotation.noTip ? `
              <div style="margin-bottom: 12px;">
                <button onclick="window.addToBlacklist(${annotation.id})" style="width: 100%; background: #ef4444; color: white; border: none; padding: 10px 12px; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 6px;">
                  <span>🚫</span>
                  <span>加入零小费黑名单</span>
                  <span style="font-size: 10px; opacity: 0.8;">(${membershipStatus.isPremium ? '会员无限制' : `免费用户 ${blacklistAddresses.length}/5`})</span>
                </button>
              </div>
              ` : ''}
              
              <!-- ESC 键提示 -->
              <div style="text-align: center; padding: 8px; border-top: 1px solid #e5e7eb; margin-top: 8px;">
                <span style="font-size: 10px; color: #9ca3af;">💡 按 ESC 或点击 ❌ 关闭窗口</span>
              </div>
            </div>
          `
        });

        // 设置全局收藏函数
        window.favoriteAnnotation = (annotationId) => {
          const annotation = sampleAnnotations.find(a => a.id === annotationId);
          if (annotation) {
            setCurrentAnnotationToFavorite(annotation);
            setShowFavoriteModal(true);
            detailInfoWindow.close();
          }
        };

        // 设置快速收藏函数（从悬停提示触发）
        window.favoriteAnnotationQuick = (annotationId) => {
          const annotation = sampleAnnotations.find(a => a.id === annotationId);
          if (annotation) {
            setCurrentAnnotationToFavorite(annotation);
            setShowFavoriteModal(true);
            // 关闭所有悬停提示
            if (window.currentHoverTooltip) {
              window.currentHoverTooltip.close();
              window.currentHoverTooltip = null;
            }
          }
        };

        // 设置全局点赞函数
        window.likeAnnotation = (annotationId) => {
          handleLikeAnnotation(annotationId);
        };

        // 设置查看所有评价函数
        window.showAllReviews = (annotationId) => {
          const annotation = sampleAnnotations.find(a => a.id === annotationId);
          if (annotation) {
            setCurrentAnnotationForReviews(annotation);
            setShowAllReviewsModal(true);
            detailInfoWindow.close();
          }
        };

        // 设置添加新评价函数  
        window.addNewReview = (annotationId) => {
          const annotation = sampleAnnotations.find(a => a.id === annotationId);
          if (annotation) {
            setCurrentAnnotationForNewReview(annotation);
            setShowAddReviewModal(true);
            detailInfoWindow.close();
          }
        };

        // 设置关闭InfoWindow函数
        window.closeInfoWindow = () => {
          detailInfoWindow.close();
        };

        // 设置添加到黑名单函数
        window.addToBlacklist = (annotationId) => {
          const annotation = sampleAnnotations.find(a => a.id === annotationId);
          if (annotation) {
            addToBlacklist(annotation);
          }
        };

        // 存储当前的detailInfoWindow到全局变量以便ESC键控制
        window.currentDetailInfoWindow = detailInfoWindow;

        // 鼠标悬停显示完整信息
        marker.addListener('mouseover', () => {
          // 关闭其他可能打开的悬停提示
          if (window.currentHoverTooltip && window.currentHoverTooltip !== hoverTooltip) {
            window.currentHoverTooltip.close();
          }
          
          hoverTooltip.open(mapInstance, marker);
          window.currentHoverTooltip = hoverTooltip;
          
          // 标记放大效果，移除文字标签
          marker.setIcon({
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 18,
            fillColor: markerColor,
            fillOpacity: 0.95,
            strokeWeight: 3,
            strokeColor: '#FFFFFF'
          });
          marker.setLabel(null);
        });

        marker.addListener('mouseout', () => {
          hoverTooltip.close();
          if (window.currentHoverTooltip === hoverTooltip) {
            window.currentHoverTooltip = null;
          }
          
          // 标记恢复原大小，恢复文字标签
          marker.setIcon({
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 12,
            fillColor: markerColor,
            fillOpacity: 0.9,
            strokeWeight: 2,
            strokeColor: '#FFFFFF'
          });
          marker.setLabel({
            text: annotation.overallRating.toFixed(1),
            color: '#FFFFFF',
            fontSize: '11px',
            fontWeight: 'bold',
            fontFamily: 'Inter, sans-serif'
          });
        });

        // 点击显示详细信息
        marker.addListener('click', () => {
          // 关闭悬停提示
          if (hoverTooltip) {
            hoverTooltip.close();
          }
          // 关闭之前的InfoWindow
          if (window.currentDetailInfoWindow && window.currentDetailInfoWindow !== detailInfoWindow) {
            window.currentDetailInfoWindow.close();
          }
          // 打开新的InfoWindow
          detailInfoWindow.open(mapInstance, marker);
          // 更新全局引用
          window.currentDetailInfoWindow = detailInfoWindow;
        });

        // 监听InfoWindow关闭事件，清理全局引用
        detailInfoWindow.addListener('closeclick', () => {
          if (window.currentDetailInfoWindow === detailInfoWindow) {
            window.currentDetailInfoWindow = null;
          }
        });
      });

      setMap(mapInstance);
      
      // 初始化搜索自动补全
      if (searchRef.current && window.google.maps.places) {
        const autocompleteInstance = new window.google.maps.places.Autocomplete(
          searchRef.current,
          {
            types: ['establishment', 'geocode'],
            componentRestrictions: { country: 'ca' }, // 限制为加拿大
            fields: ['place_id', 'geometry', 'name', 'formatted_address']
          }
        );
        
        setAutocomplete(autocompleteInstance);
        
        autocompleteInstance.addListener('place_changed', () => {
          const place = autocompleteInstance.getPlace();
          
          if (!place.geometry || !place.geometry.location) {
            console.log("No details available for input: '" + place.name + "'");
            return;
          }
          
          // 移动地图到选择的位置
          const location = place.geometry.location;
          mapInstance.setCenter(location);
          mapInstance.setZoom(17);
          
          // 添加标记
          const marker = new window.google.maps.Marker({
            position: location,
            map: mapInstance,
            title: place.name || '搜索位置',
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: '#3b82f6',
              fillOpacity: 1,
              strokeWeight: 2,
              strokeColor: '#FFFFFF'
            }
          });
          
          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div style="padding: 12px; max-width: 300px; font-family: Inter, sans-serif;">
                <h3 style="font-weight: 600; color: #111827; margin-bottom: 8px; font-size: 14px;">${place.name || '搜索位置'}</h3>
                <p style="font-size: 12px; color: #6b7280; margin-bottom: 8px;">${place.formatted_address}</p>
                <p style="font-size: 11px; color: #3b82f6;">🔍 搜索结果</p>
              </div>
            `
          });
          
          marker.addListener('click', () => {
            infoWindow.open(mapInstance, marker);
          });
          
          // 自动打开信息窗口
          infoWindow.open(mapInstance, marker);
          
          // 添加到搜索历史
          const searchTerm = place.name || place.formatted_address || '';
          if (searchTerm && !searchHistory.includes(searchTerm)) {
            setSearchHistory(prev => [searchTerm, ...prev.slice(0, 4)]);
          }
          
          setShowSuggestions(false);
        });
      }
    };

    // 检查Google Maps API是否已加载
    if (window.google && window.google.maps) {
      initMap();
    } else {
      // 如果还没加载，延迟重试
      const timer = setTimeout(initMap, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAddMarkerClick = () => {
    if (!map) return;
    
    if (isAddingMarker) {
      // 取消添加模式
      setIsAddingMarker(false);
      if (clickListener) {
        window.google.maps.event.removeListener(clickListener);
        setClickListener(null);
      }
    } else {
      // 启动添加模式
      setIsAddingMarker(true);
      const listener = map.addListener('click', async (event: any) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        
        // 使用反向地理编码获取真实地址
        const address = await getAddressFromCoordinates(lat, lng);
        
        // 设置待确认的位置信息
        setPendingLocation({ lat, lng, address });
        setShowAddAnnotationModal(true);
        
        // 清理监听器并退出添加模式
        setIsAddingMarker(false);
        window.google.maps.event.removeListener(listener);
        setClickListener(null);
      });
      
      setClickListener(listener);
    }
  };

  // 确认添加标注
  const handleConfirmAnnotation = () => {
    if (!pendingLocation || !map) return;

    const { lat, lng, address } = pendingLocation;
    const { parkingRating, hasDog, tipRating, noTip, overallRating, notes, title } = annotationForm;
    
    // 根据总体评分确定标记颜色
    const markerColor = overallRating >= 4.5 ? '#22c55e' : 
                       overallRating >= 3.5 ? '#eab308' : 
                       overallRating >= 2.5 ? '#f97316' : '#ef4444';
    
    // 在地图上添加标记
    const marker = new window.google.maps.Marker({
      position: { lat, lng },
      map: map,
      title: title || '新标注',
      label: {
        text: overallRating.toFixed(1),
        color: '#FFFFFF',
        fontSize: '11px',
        fontWeight: 'bold',
        fontFamily: 'Inter, sans-serif'
      },
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 12,
        fillColor: markerColor,
        fillOpacity: 0.9,
        strokeWeight: 2,
        strokeColor: '#FFFFFF'
      }
    });

    // 创建详细的信息窗口
    const parkingText = parkingRating >= 4 ? '停车便利' : parkingRating >= 3 ? '停车一般' : '停车困难';
    const tipText = noTip ? '无小费!' : tipRating >= 4 ? '小费大方' : tipRating >= 3 ? '小费一般' : '小费较少';
    
    const infoWindow = new window.google.maps.InfoWindow({
      content: `
        <div style="padding: 14px; max-width: 320px; font-family: Inter, sans-serif;">
          <h3 style="font-weight: 600; color: #111827; margin-bottom: 8px; font-size: 15px;">${title || '新标注'}</h3>
          <p style="font-size: 12px; color: #6b7280; margin-bottom: 12px;">${address}</p>
          
          <div style="display: flex; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 16px; margin-right: 6px;">⭐</span>
            <span style="font-size: 13px; font-weight: 600; color: #111827;">${overallRating.toFixed(1)} 分总体评价</span>
          </div>
          
          <div style="display: flex; gap: 6px; margin-bottom: 10px; flex-wrap: wrap;">
            <span style="display: inline-flex; align-items: center; padding: 3px 8px; border-radius: 12px; font-size: 11px; font-weight: 500; ${
              parkingRating >= 4 ? 'background-color: #dcfce7; color: #166534;' : 
              parkingRating >= 3 ? 'background-color: #fef3c7; color: #92400e;' : 'background-color: #fecaca; color: #991b1b;'
            }">
              🚗 ${parkingText}
            </span>
            ${hasDog ? '<span style="display: inline-flex; align-items: center; padding: 3px 8px; border-radius: 12px; font-size: 11px; font-weight: 500; background-color: #fecaca; color: #991b1b;">🐕 有恶犬</span>' : ''}
            <span style="display: inline-flex; align-items: center; padding: 3px 8px; border-radius: 12px; font-size: 11px; font-weight: 500; ${
              noTip ? 'background-color: #fecaca; color: #991b1b;' :
              tipRating >= 4 ? 'background-color: #dcfce7; color: #166534;' : 
              tipRating >= 3 ? 'background-color: #fef3c7; color: #92400e;' : 'background-color: #fed7aa; color: #9a3412;'
            }">
              💰 ${tipText}
            </span>
          </div>
          
          ${notes ? `<p style="font-size: 11px; color: #6b7280; background-color: #f9fafb; padding: 8px; border-radius: 6px; margin-top: 8px;">💭 ${notes}</p>` : ''}
          
          <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #f3f4f6;">
            <p style="font-size: 10px; color: #9ca3af;">刚刚添加 • 司机评价</p>
          </div>
        </div>
      `
    });

    marker.addListener('click', () => {
      infoWindow.open(map, marker);
    });
    
    // 通知父组件，传递完整的标注数据
    if (onAddAnnotation) {
      onAddAnnotation({ 
        lat, 
        lng, 
        address,
        title: title || '新标注',
        overallRating,
        parkingRating,
        hasDog,
        tipRating,
        noTip,
        notes
      });
    }
    
    // 重置表单并关闭弹窗
    setAnnotationForm({
      parkingRating: 5,
      hasDog: false,
      tipRating: 5,
      noTip: false,
      overallRating: 5,
      notes: '',
      title: ''
    });
    setShowAddAnnotationModal(false);
    setPendingLocation(null);
    
    // 自动打开信息窗口
    setTimeout(() => {
      infoWindow.open(map, marker);
    }, 100);
  };

  // 取消添加标注
  const handleCancelAnnotation = () => {
    setAnnotationForm({
      parkingRating: 5,
      hasDog: false,
      tipRating: 5,
      noTip: false,
      overallRating: 5,
      notes: '',
      title: ''
    });
    setShowAddAnnotationModal(false);
    setPendingLocation(null);
  };

  // 添加到收藏分组
  const handleAddToFavoriteGroup = (groupId: number) => {
    if (currentAnnotationToFavorite) {
      const selectedGroup = favoriteGroups.find(g => g.id === groupId);
      console.log(`✅ 将 "${currentAnnotationToFavorite.title}" 添加到 "${selectedGroup?.name}" 分组`);
      
      // 更新分组计数
      setFavoriteGroups(prev => prev.map(group => 
        group.id === groupId 
          ? { ...group, count: group.count + 1 }
          : group
      ));

      // 显示成功提示（可以用toast组件替代）
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = `
        <div style="position: fixed; top: 20px; right: 20px; background: #22c55e; color: white; padding: 12px 20px; border-radius: 8px; z-index: 9999; font-family: Inter, sans-serif; font-size: 14px; animation: slideIn 0.3s ease-out;">
          ${selectedGroup?.icon} 已收藏到 "${selectedGroup?.name}"
        </div>
      `;
      document.body.appendChild(tempDiv);
      
      // 3秒后移除提示
      setTimeout(() => {
        if (document.body.contains(tempDiv)) {
          document.body.removeChild(tempDiv);
        }
      }, 3000);

      setShowFavoriteModal(false);
      setCurrentAnnotationToFavorite(null);
    }
  };

  // 创建新的收藏分组
  const handleCreateNewGroup = () => {
    if (newGroupName.trim()) {
      const newGroup = {
        id: Date.now(),
        name: newGroupName.trim(),
        color: selectedGroupColor,
        icon: selectedGroupIcon,
        count: 0
      };
      setFavoriteGroups(prev => [...prev, newGroup]);
      setNewGroupName('');
      setSelectedGroupIcon('📁');
      setSelectedGroupColor('#6b7280');
      setShowGroupManager(false);
    }
  };

  // 删除收藏分组
  const handleDeleteGroup = (groupId: number) => {
    setFavoriteGroups(prev => prev.filter(group => group.id !== groupId));
  };

  // 计算两个坐标之间的距离（公里）
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // 地球半径（公里）
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // 获取附近的零小费地址
  const getNearbyBlacklistAddresses = (centerLat: number, centerLng: number, radius: number) => {
    return sampleAnnotations.filter(annotation => {
      if (!annotation.noTip) return false;
      const distance = calculateDistance(centerLat, centerLng, annotation.lat, annotation.lng);
      return distance <= radius;
    });
  };

  // 检查是否可以添加到黑名单
  const canAddToBlacklist = (): boolean => {
    if (membershipStatus.isPremium) return true;
    return blacklistAddresses.length < 5;
  };

  // 添加到黑名单
  const addToBlacklist = (annotation: any) => {
    if (!canAddToBlacklist()) {
      // 显示升级提示
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = `
        <div style="position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background: #ef4444; color: white; padding: 12px 20px; border-radius: 8px; z-index: 9999; font-family: Inter, sans-serif; font-size: 14px; animation: slideDown 0.3s ease-out;">
          ⚠️ 免费用户只能保存5个黑名单地址，请升级会员解锁无限制保存
        </div>
      `;
      document.body.appendChild(tempDiv);
      
      setTimeout(() => {
        if (document.body.contains(tempDiv)) {
          document.body.removeChild(tempDiv);
        }
      }, 4000);
      return false;
    }

    setBlacklistAddresses(prev => {
      if (prev.find(addr => addr.id === annotation.id)) {
        return prev; // 已存在
      }
      return [...prev, annotation];
    });

    // 显示成功提示
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = `
      <div style="position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background: #22c55e; color: white; padding: 12px 20px; border-radius: 8px; z-index: 9999; font-family: Inter, sans-serif; font-size: 14px; animation: slideDown 0.3s ease-out;">
        🚫 已添加到黑名单: ${annotation.title}
      </div>
    `;
    document.body.appendChild(tempDiv);
    
    setTimeout(() => {
      if (document.body.contains(tempDiv)) {
        document.body.removeChild(tempDiv);
      }
    }, 3000);
    
    return true;
  };

  // 处理点赞
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

  // 星级评分组件
  const StarRating = ({ rating, onRatingChange, label }: { rating: number; onRatingChange: (rating: number) => void; label: string }) => (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium text-gray-700 w-16">{label}:</span>
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onRatingChange(star)}
            className={`text-xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400 transition-colors`}
          >
            ⭐
          </button>
        ))}
        <span className="text-sm text-gray-600 ml-2">{rating}/5</span>
      </div>
    </div>
  );

  return (
    <div className="relative h-full bg-gray-100 rounded-xl overflow-hidden">
      {/* 搜索栏 */}
      <div className="absolute top-4 left-4 right-20 z-10">
        <div className="relative">
          <input
            ref={searchRef}
            type="text"
            placeholder="搜索地址或地点... (例: Tim Hortons, Vancouver)"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            className="w-full px-4 py-3 text-sm bg-white rounded-xl shadow-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-500"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          {/* 搜索建议下拉列表 */}
          {showSuggestions && searchHistory.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-20">
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50 border-b border-gray-100">
                最近搜索
              </div>
              {searchHistory.map((item, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setSearchValue(item);
                    // 触发Google Places搜索
                    if (searchRef.current) {
                      // 模拟用户选择
                      const event = new Event('input', { bubbles: true });
                      searchRef.current.value = item;
                      searchRef.current.dispatchEvent(event);
                    }
                    setShowSuggestions(false);
                  }}
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-b-0"
                >
                  <div className="flex items-center space-x-3">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                </div>
              ))}
              <div className="px-4 py-2 text-xs text-gray-500 bg-gray-50 border-t border-gray-100">
                💡 输入地址开始搜索更多地点
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 地图容器 */}
      <div ref={mapRef} className="w-full h-full">
        {/* 如果Google Maps API没有加载，显示模拟地图 */}
        {!window.google && (
          <div className="w-full h-full bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex items-center justify-center relative">
            {/* 模拟地图网格 */}
            <div className="absolute inset-0 opacity-20">
              <div className="w-full h-full" style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                `,
                backgroundSize: '50px 50px'
              }}></div>
            </div>
            
            {/* 示例标记点 */}
            {sampleAnnotations.map((annotation, index) => (
              <div
                key={annotation.id}
                className="absolute w-4 h-4 rounded-full border-2 border-white shadow-lg cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  backgroundColor: annotation.rating >= 4 ? '#00C851' : annotation.rating >= 3 ? '#FFB900' : '#FF4444',
                  left: `${50 + index * 20}%`,
                  top: `${40 + index * 15}%`
                }}
                title={annotation.title}
              ></div>
            ))}
            
            <div className="text-center text-white z-10">
              <div className="text-2xl font-bold mb-2">🗺️</div>
              <p className="text-lg font-semibold mb-1">DDmap 地图视图</p>
              <p className="text-sm opacity-80">Vancouver, BC - 司机标注点</p>
            </div>
          </div>
        )}
      </div>

      {/* 地图控制按钮 - 移动端优化 */}
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex flex-col space-y-2 sm:space-y-3">
        <button
          onClick={handleAddMarkerClick}
          className={`px-3 py-2 sm:px-4 sm:py-2 rounded-full font-medium text-xs sm:text-sm shadow-lg transition-all min-h-[44px] sm:min-h-auto touch-manipulation ${
            isAddingMarker
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <span className="sm:hidden">{isAddingMarker ? '点击添加' : '+ 标注'}</span>
          <span className="hidden sm:inline">{isAddingMarker ? '点击地图添加标注' : '+ 添加标注'}</span>
        </button>
        
        <button
          onClick={() => setShowGroupManager(true)}
          className="px-3 py-2 sm:px-4 sm:py-2 bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 rounded-full font-medium text-xs sm:text-sm shadow-lg transition-all min-h-[44px] sm:min-h-auto touch-manipulation"
        >
          <span className="sm:hidden">📁 收藏</span>
          <span className="hidden sm:inline">📁 管理收藏</span>
        </button>

        {/* 会员功能按钮 */}
        <div className="flex flex-col space-y-2">
          <button
            onClick={() => setShowMembershipModal(true)}
            className={`px-3 py-2 sm:px-4 sm:py-2 rounded-full font-medium text-xs sm:text-sm shadow-lg transition-all min-h-[44px] sm:min-h-auto touch-manipulation ${
              membershipStatus.isPremium
                ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white border-none'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <span className="sm:hidden">{membershipStatus.isPremium ? '👑 会员' : '⭐ 会员'}</span>
            <span className="hidden sm:inline">{membershipStatus.isPremium ? '👑 会员中心' : '⭐ 升级会员'}</span>
          </button>
          
          {membershipStatus.isPremium && (
            <button
              onClick={() => setShowNearbyBlacklistModal(true)}
              className="px-3 py-2 sm:px-4 sm:py-2 bg-red-500 text-white hover:bg-red-600 border-none rounded-full font-medium text-xs sm:text-sm shadow-lg transition-all min-h-[44px] sm:min-h-auto touch-manipulation"
            >
              <span className="sm:hidden">🚫 预警</span>
              <span className="hidden sm:inline">🚫 零小费预警</span>
            </button>
          )}
        </div>
      </div>

      {/* 图例和点赞排行 - 移动端优化 */}
      <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 bg-white rounded-xl shadow-lg p-3 sm:p-4 text-xs border border-gray-200 max-w-[280px] sm:max-w-none">
        <div className="mb-3 sm:mb-4">
          <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-xs sm:text-sm">📍 评分图例</h4>
          <div className="space-y-1 sm:space-y-2">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-500 border-2 border-white shadow-sm flex items-center justify-center">
                <span className="text-white font-bold text-xs">4.5</span>
              </div>
              <span className="text-gray-700 font-medium text-xs sm:text-sm">
                <span className="sm:hidden">优秀</span>
                <span className="hidden sm:inline">优秀 (4.5-5分)</span>
              </span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-yellow-500 border-2 border-white shadow-sm flex items-center justify-center">
                <span className="text-white font-bold text-xs">4.0</span>
              </div>
              <span className="text-gray-700 font-medium text-xs sm:text-sm">
                <span className="sm:hidden">良好</span>
                <span className="hidden sm:inline">良好 (3.5-4.5分)</span>
              </span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-orange-500 border-2 border-white shadow-sm flex items-center justify-center">
                <span className="text-white font-bold text-xs">3.0</span>
              </div>
              <span className="text-gray-700 font-medium text-xs sm:text-sm">
                <span className="sm:hidden">一般</span>
                <span className="hidden sm:inline">一般 (2.5-3.5分)</span>
              </span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-red-500 border-2 border-white shadow-sm flex items-center justify-center">
                <span className="text-white font-bold text-xs">2.0</span>
              </div>
              <span className="text-gray-700 font-medium text-xs sm:text-sm">
                <span className="sm:hidden">较差</span>
                <span className="hidden sm:inline">较差 (&lt;2.5分)</span>
              </span>
            </div>
          </div>
        </div>
        
        {/* 点赞排行榜 */}
        <div className="border-t border-gray-200 pt-2 sm:pt-3">
          <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-xs sm:text-sm flex items-center gap-1">
            <span>👍</span>
            <span className="sm:hidden">热门</span>
            <span className="hidden sm:inline">热门标注</span>
          </h4>
          <div className="space-y-1">
            {[...sampleAnnotations]
              .sort((a, b) => b.likes - a.likes)
              .slice(0, 3)
              .map((annotation, index) => (
                <div key={annotation.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className={`font-bold ${
                      index === 0 ? 'text-yellow-600' : 
                      index === 1 ? 'text-gray-600' : 'text-orange-600'
                    }`}>
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                    </span>
                    <span className="text-gray-700 truncate max-w-16 sm:max-w-24" title={annotation.title}>
                      {annotation.title.length > 8 ? annotation.title.substring(0, 8) + '...' : annotation.title}
                    </span>
                  </div>
                  <span className="text-gray-500 font-medium">{annotation.likes}👍</span>
                </div>
              ))
            }
          </div>
        </div>
        
        <div className="mt-2 pt-2 sm:mt-3 sm:pt-3 border-t border-gray-200 hidden sm:block">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-gray-500">
              <span className="text-xs">🖱️</span>
              <span className="text-xs">悬停显示完整标注</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-500">
              <span className="text-xs">👆</span>
              <span className="text-xs">点击查看详细评价</span>
            </div>
          </div>
        </div>
      </div>

      {/* 添加标注评分弹窗 */}
      {showAddAnnotationModal && pendingLocation && (
        <div 
          className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            // 点击蒙层关闭弹窗
            if (e.target === e.currentTarget) {
              setShowAddAnnotationModal(false);
              setPendingLocation(null);
              setAnnotationForm({
                parkingRating: 5,
                hasDog: false,
                tipRating: 5,
                noTip: false,
                overallRating: 5,
                notes: '',
                title: ''
              });
            }
          }}
        >
          <div className="bg-white rounded-2xl p-4 sm:p-6 max-w-xs sm:max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl relative mx-4 sm:mx-0">
            {/* 关闭按钮 */}
            <button
              onClick={() => {
                setShowAddAnnotationModal(false);
                setPendingLocation(null);
                setAnnotationForm({
                  parkingRating: 5,
                  hasDog: false,
                  tipRating: 5,
                  noTip: false,
                  overallRating: 5,
                  notes: '',
                  title: ''
                });
              }}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">为地址添加评价</h3>
              <p className="text-sm text-gray-600">分享您在此地址的配送体验</p>
              <div className="flex items-center justify-center gap-4 mt-3 text-sm text-gray-600">
                <span>📍 新地址标注</span>
                <span className="text-xs text-gray-400">按 ESC 取消</span>
              </div>
            </div>
            
            {/* 地址信息 */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900 mb-1">配送地址</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{pendingLocation.address}</p>
                </div>
              </div>
            </div>

            {/* 标注标题 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">地点名称 (选填)</label>
              <input
                type="text"
                placeholder="例: 客户小张家、CBD办公楼..."
                value={annotationForm.title}
                onChange={(e) => setAnnotationForm(prev => ({...prev, title: e.target.value}))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            
            {/* 评分系统 */}
            <div className="space-y-4 mb-6">
              <StarRating 
                rating={annotationForm.overallRating}
                onRatingChange={(rating) => setAnnotationForm(prev => ({...prev, overallRating: rating}))}
                label="总体评分"
              />
              
              <StarRating 
                rating={annotationForm.parkingRating}
                onRatingChange={(rating) => setAnnotationForm(prev => ({...prev, parkingRating: rating}))}
                label="停车便利"
              />
              
              <div className="flex items-center justify-between">
                <StarRating 
                  rating={annotationForm.tipRating}
                  onRatingChange={(rating) => setAnnotationForm(prev => ({...prev, tipRating: rating, noTip: false}))}
                  label="小费大方"
                />
              </div>
            </div>

            {/* 特殊选项 */}
            <div className="space-y-3 mb-6">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={annotationForm.hasDog}
                  onChange={(e) => setAnnotationForm(prev => ({...prev, hasDog: e.target.checked}))}
                  className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="text-sm font-medium text-gray-700">🐕 有恶犬 (注意安全)</span>
              </label>
              
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={annotationForm.noTip}
                  onChange={(e) => setAnnotationForm(prev => ({...prev, noTip: e.target.checked, tipRating: e.target.checked ? 1 : 5}))}
                  className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <span className="text-sm font-medium text-red-700">⚠️ 零小费! (特别提醒)</span>
              </label>
            </div>

            {/* 文字评价 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">配送备注 (选填)</label>
              <textarea
                rows={3}
                placeholder="分享更多配送经验: 楼层信息、注意事项、客户特点等..."
                value={annotationForm.notes}
                onChange={(e) => setAnnotationForm(prev => ({...prev, notes: e.target.value}))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                maxLength={200}
              />
              <div className="text-right mt-1">
                <span className="text-xs text-gray-500">{annotationForm.notes.length}/200</span>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleCancelAnnotation}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleConfirmAnnotation}
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
              >
                发布评价
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 收藏分组选择弹窗 */}
      {showFavoriteModal && currentAnnotationToFavorite && (
        <div 
          className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            // 点击蒙层关闭弹窗
            if (e.target === e.currentTarget) {
              setShowFavoriteModal(false);
              setCurrentAnnotationToFavorite(null);
            }
          }}
        >
          <div className="bg-white rounded-2xl p-4 sm:p-6 max-w-xs sm:max-w-md w-full shadow-2xl relative mx-4 sm:mx-0">
            {/* 关闭按钮 */}
            <button
              onClick={() => {
                setShowFavoriteModal(false);
                setCurrentAnnotationToFavorite(null);
              }}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">收藏到分组</h3>
              <p className="text-sm text-gray-600">选择要收藏到的分组</p>
              <div className="flex items-center justify-center gap-4 mt-3 text-sm text-gray-600">
                <span>⭐ 收藏标注</span>
                <span className="text-xs text-gray-400">按 ESC 取消</span>
              </div>
            </div>

            <div className="mb-6">
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <h4 className="font-semibold text-gray-900 text-sm">{currentAnnotationToFavorite.title}</h4>
                <p className="text-xs text-gray-600 mt-1">{currentAnnotationToFavorite.address}</p>
                <div className="flex items-center mt-2">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    ⭐ {currentAnnotationToFavorite.overallRating.toFixed(1)} 分
                  </span>
                </div>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {favoriteGroups.map((group) => {
                  // 智能推荐逻辑
                  const isRecommended = 
                    (group.name === '小费好顾客' && currentAnnotationToFavorite.tipRating >= 4 && !currentAnnotationToFavorite.noTip) ||
                    (group.name === '零小费黑名单' && currentAnnotationToFavorite.noTip) ||
                    (group.name === '停车便利' && currentAnnotationToFavorite.parkingRating >= 4) ||
                    (group.name === '友善客户' && currentAnnotationToFavorite.overallRating >= 4.5);

                  return (
                    <button
                      key={group.id}
                      onClick={() => handleAddToFavoriteGroup(group.id)}
                      className={`w-full flex items-center justify-between p-3 border rounded-xl transition-colors ${
                        isRecommended 
                          ? 'border-blue-300 bg-blue-50 hover:bg-blue-100' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm relative"
                          style={{ backgroundColor: group.color }}
                        >
                          {group.icon}
                          {isRecommended && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                              <span style={{ fontSize: '8px', color: 'white' }}>✨</span>
                            </div>
                          )}
                        </div>
                        <div className="text-left">
                          <div className="flex items-center space-x-2">
                            <p className="font-medium text-gray-900 text-sm">{group.name}</p>
                            {isRecommended && (
                              <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">推荐</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">{group.count} 个标注</p>
                        </div>
                      </div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowFavoriteModal(false);
                  setCurrentAnnotationToFavorite(null);
                }}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => setShowGroupManager(true)}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                新建分组
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 分组管理弹窗 */}
      {showGroupManager && (
        <div 
          className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            // 点击蒙层关闭弹窗
            if (e.target === e.currentTarget) {
              setShowGroupManager(false);
            }
          }}
        >
          <div className="bg-white rounded-2xl p-4 sm:p-6 max-w-xs sm:max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl relative mx-4 sm:mx-0">
            {/* 关闭按钮 */}
            <button
              onClick={() => setShowGroupManager(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">管理收藏分组</h3>
              <p className="text-sm text-gray-600">创建和管理您的收藏分组</p>
              <div className="flex items-center justify-center gap-4 mt-3 text-sm text-gray-600">
                <span>📁 分组管理</span>
                <span className="text-xs text-gray-400">按 ESC 关闭</span>
              </div>
            </div>

            {/* 新建分组 */}
            <div className="mb-6 p-4 bg-gray-50 rounded-xl">
              <h4 className="font-semibold text-gray-900 text-sm mb-3">新建分组</h4>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="分组名称..."
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                
                <div className="flex items-center space-x-3">
                  <label className="text-sm font-medium text-gray-700">图标:</label>
                  <div className="flex space-x-2">
                    {['📁', '💰', '⚠️', '🚗', '😊', '⭐', '🏠', '🔴'].map((icon) => (
                      <button
                        key={icon}
                        onClick={() => setSelectedGroupIcon(icon)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center border-2 transition-colors ${
                          selectedGroupIcon === icon
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <label className="text-sm font-medium text-gray-700">颜色:</label>
                  <div className="flex space-x-2">
                    {['#22c55e', '#ef4444', '#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#f97316', '#6b7280'].map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedGroupColor(color)}
                        className={`w-6 h-6 rounded-full border-2 ${
                          selectedGroupColor === color ? 'border-gray-800' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleCreateNewGroup}
                  disabled={!newGroupName.trim()}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  创建分组
                </button>
              </div>
            </div>

            {/* 现有分组列表 */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 text-sm mb-3">现有分组</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {favoriteGroups.map((group) => (
                  <div
                    key={group.id}
                    className="border border-gray-200 rounded-xl overflow-hidden"
                  >
                    <div className="flex items-center justify-between p-3">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                          style={{ backgroundColor: group.color }}
                        >
                          {group.icon}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{group.name}</p>
                          <p className="text-xs text-gray-500">{group.count} 个标注</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {/* 展开/收起地址列表 */}}
                          className="text-blue-500 hover:text-blue-700 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteGroup(group.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    {/* 模拟收藏地址列表（根据分组） */}
                    {group.count > 0 && (
                      <div className="border-t border-gray-100 bg-gray-50">
                        <div className="p-3">
                          <div className="text-xs font-medium text-gray-600 mb-2">收藏的地址：</div>
                          <div className="space-y-2">
                            {/* 这里可以根据实际数据展示对应分组的地址 */}
                            {group.name === '小费好顾客' && (
                              <div className="flex items-center justify-between bg-white rounded-lg p-2">
                                <div className="flex-1">
                                  <p className="text-xs font-medium text-gray-900">高档公寓楼</p>
                                  <p className="text-xs text-gray-500">700 W Georgia St, Vancouver...</p>
                                </div>
                                <div className="flex items-center space-x-1 text-xs">
                                  <span>⭐</span>
                                  <span className="font-semibold">4.2</span>
                                </div>
                              </div>
                            )}
                            {group.name === '零小费黑名单' && (
                              <div className="flex items-center justify-between bg-white rounded-lg p-2">
                                <div className="flex-1">
                                  <p className="text-xs font-medium text-gray-900">联排别墅区</p>
                                  <p className="text-xs text-gray-500">1625 Manitoba St, Vancouver...</p>
                                </div>
                                <div className="flex items-center space-x-1 text-xs">
                                  <span>⭐</span>
                                  <span className="font-semibold">2.1</span>
                                </div>
                              </div>
                            )}
                            {group.name === '友善客户' && (
                              <div className="flex items-center justify-between bg-white rounded-lg p-2">
                                <div className="flex-1">
                                  <p className="text-xs font-medium text-gray-900">商务办公楼</p>
                                  <p className="text-xs text-gray-500">1055 W Hastings St, Vancouver...</p>
                                </div>
                                <div className="flex items-center space-x-1 text-xs">
                                  <span>⭐</span>
                                  <span className="font-semibold">4.8</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowGroupManager(false)}
              className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              完成
            </button>
          </div>
        </div>
      )}

      {/* 查看所有评价弹窗 */}
      {showAllReviewsModal && currentAnnotationForReviews && (
        <div 
          className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            // 点击蒙层关闭弹窗
            if (e.target === e.currentTarget) {
              setShowAllReviewsModal(false);
              setCurrentAnnotationForReviews(null);
            }
          }}
        >
          <div className="bg-white rounded-2xl p-4 sm:p-6 max-w-sm sm:max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative mx-4 sm:mx-0">
            {/* 关闭按钮 */}
            <button
              onClick={() => {
                setShowAllReviewsModal(false);
                setCurrentAnnotationForReviews(null);
              }}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">所有评价</h3>
              <p className="text-sm text-gray-600">{currentAnnotationForReviews.title}</p>
              <p className="text-xs text-gray-500 mt-1">{currentAnnotationForReviews.address}</p>
              <div className="flex items-center justify-center gap-4 mt-3 text-sm text-gray-600">
                <span>📊 {currentAnnotationForReviews.allReviews.length} 条评价</span>
                <span>⭐ {currentAnnotationForReviews.overallRating.toFixed(1)} 平均分</span>
                <span className="text-xs text-gray-400">按 ESC 关闭</span>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              {currentAnnotationForReviews.allReviews.map((review, index) => {
                const parkingText = review.parkingRating >= 4 ? '停车便利' : review.parkingRating >= 3 ? '停车一般' : '停车困难';
                const tipText = review.noTip ? '无小费!' : review.tipRating >= 4 ? '小费大方' : review.tipRating >= 3 ? '小费一般' : '小费较少';
                
                return (
                  <div key={review.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{review.author[review.author.length - 1]}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{review.author}</p>
                          <p className="text-xs text-gray-500">{review.createdAt}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSampleAnnotations(prev => prev.map(annotation => {
                              if (annotation.id === currentAnnotationForReviews.id) {
                                const updatedReviews = annotation.allReviews.map(r => {
                                  if (r.id === review.id) {
                                    const newIsLiked = !r.isLiked;
                                    return {
                                      ...r,
                                      isLiked: newIsLiked,
                                      likes: newIsLiked ? r.likes + 1 : r.likes - 1
                                    };
                                  }
                                  return r;
                                });
                                return { ...annotation, allReviews: updatedReviews };
                              }
                              return annotation;
                            }));
                            setCurrentAnnotationForReviews(prev => ({
                              ...prev,
                              allReviews: prev.allReviews.map(r => {
                                if (r.id === review.id) {
                                  const newIsLiked = !r.isLiked;
                                  return {
                                    ...r,
                                    isLiked: newIsLiked,
                                    likes: newIsLiked ? r.likes + 1 : r.likes - 1
                                  };
                                }
                                return r;
                              })
                            }));
                          }}
                          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-all ${
                            review.isLiked 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          <span>{review.isLiked ? '👍' : '🤍'}</span>
                          <span>{review.likes}</span>
                        </button>
                        <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                          <span className="text-yellow-500 text-sm">⭐</span>
                          <span className="text-sm font-semibold text-gray-700 ml-1">{review.overallRating.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mb-3 flex-wrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        review.parkingRating >= 4 ? 'bg-green-100 text-green-800' :
                        review.parkingRating >= 3 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        🚗 {parkingText}
                      </span>
                      {review.hasDog && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          🐕 有恶犬
                        </span>
                      )}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        review.noTip ? 'bg-red-100 text-red-800' :
                        review.tipRating >= 4 ? 'bg-green-100 text-green-800' : 
                        review.tipRating >= 3 ? 'bg-yellow-100 text-yellow-800' : 'bg-orange-100 text-orange-800'
                      }`}>
                        💰 {tipText}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">💭 {review.notes}</p>
                  </div>
                );
              })}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowAllReviewsModal(false);
                  setCurrentAnnotationForReviews(null);
                }}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                关闭
              </button>
              <button
                onClick={() => {
                  setShowAllReviewsModal(false);
                  setCurrentAnnotationForNewReview(currentAnnotationForReviews);
                  setShowAddReviewModal(true);
                }}
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
              >
                ✍️ 添加我的评价
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 添加新评价弹窗 */}
      {showAddReviewModal && currentAnnotationForNewReview && (
        <div 
          className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            // 点击蒙层关闭弹窗
            if (e.target === e.currentTarget) {
              setShowAddReviewModal(false);
              setCurrentAnnotationForNewReview(null);
              setAnnotationForm({
                parkingRating: 5,
                hasDog: false,
                tipRating: 5,
                noTip: false,
                overallRating: 5,
                notes: '',
                title: ''
              });
            }
          }}
        >
          <div className="bg-white rounded-2xl p-4 sm:p-6 max-w-xs sm:max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl relative mx-4 sm:mx-0">
            {/* 关闭按钮 */}
            <button
              onClick={() => {
                setShowAddReviewModal(false);
                setCurrentAnnotationForNewReview(null);
                setAnnotationForm({
                  parkingRating: 5,
                  hasDog: false,
                  tipRating: 5,
                  noTip: false,
                  overallRating: 5,
                  notes: '',
                  title: ''
                });
              }}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">添加评价</h3>
              <p className="text-sm text-gray-600">{currentAnnotationForNewReview.title}</p>
              <p className="text-xs text-gray-500 mt-1">{currentAnnotationForNewReview.address}</p>
              <div className="flex items-center justify-center gap-4 mt-3 text-sm text-gray-600">
                <span>✍️ 分享你的配送体验</span>
                <span className="text-xs text-gray-400">按 ESC 取消</span>
              </div>
            </div>
            
            {/* 评分系统 */}
            <div className="space-y-4 mb-6">
              <StarRating 
                rating={annotationForm.overallRating}
                onRatingChange={(rating) => setAnnotationForm(prev => ({...prev, overallRating: rating}))}
                label="总体评分"
              />
              
              <StarRating 
                rating={annotationForm.parkingRating}
                onRatingChange={(rating) => setAnnotationForm(prev => ({...prev, parkingRating: rating}))}
                label="停车便利"
              />
              
              <StarRating 
                rating={annotationForm.tipRating}
                onRatingChange={(rating) => setAnnotationForm(prev => ({...prev, tipRating: rating, noTip: false}))}
                label="小费大方"
              />
            </div>

            {/* 特殊选项 */}
            <div className="space-y-3 mb-6">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={annotationForm.hasDog}
                  onChange={(e) => setAnnotationForm(prev => ({...prev, hasDog: e.target.checked}))}
                  className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="text-sm font-medium text-gray-700">🐕 有恶犬 (注意安全)</span>
              </label>
              
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={annotationForm.noTip}
                  onChange={(e) => setAnnotationForm(prev => ({...prev, noTip: e.target.checked, tipRating: e.target.checked ? 1 : 5}))}
                  className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <span className="text-sm font-medium text-red-700">⚠️ 零小费! (特别提醒)</span>
              </label>
            </div>

            {/* 文字评价 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">我的评价 (选填)</label>
              <textarea
                rows={3}
                placeholder="分享您的配送经验: 客户态度、配送细节、注意事项等..."
                value={annotationForm.notes}
                onChange={(e) => setAnnotationForm(prev => ({...prev, notes: e.target.value}))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                maxLength={200}
              />
              <div className="text-right mt-1">
                <span className="text-xs text-gray-500">{annotationForm.notes.length}/200</span>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowAddReviewModal(false);
                  setCurrentAnnotationForNewReview(null);
                  setAnnotationForm({
                    parkingRating: 5,
                    hasDog: false,
                    tipRating: 5,
                    noTip: false,
                    overallRating: 5,
                    notes: '',
                    title: ''
                  });
                }}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => {
                  // 添加新评价到现有标注
                  const newReview = {
                    id: Date.now(),
                    author: '当前司机', // 在实际应用中应该从用户状态获取
                    overallRating: annotationForm.overallRating,
                    parkingRating: annotationForm.parkingRating,
                    tipRating: annotationForm.tipRating,
                    hasDog: annotationForm.hasDog,
                    noTip: annotationForm.noTip,
                    notes: annotationForm.notes || '司机评价',
                    createdAt: '刚刚',
                    likes: 0,
                    isLiked: false
                  };

                  setSampleAnnotations(prev => prev.map(annotation => {
                    if (annotation.id === currentAnnotationForNewReview.id) {
                      const updatedReviews = [...annotation.allReviews, newReview];
                      
                      // 重新计算平均分
                      const avgOverall = updatedReviews.reduce((sum, r) => sum + r.overallRating, 0) / updatedReviews.length;
                      const avgParking = updatedReviews.reduce((sum, r) => sum + r.parkingRating, 0) / updatedReviews.length;
                      const avgTip = updatedReviews.reduce((sum, r) => sum + r.tipRating, 0) / updatedReviews.length;
                      const hasAnyDog = updatedReviews.some(r => r.hasDog);
                      const hasAnyNoTip = updatedReviews.some(r => r.noTip);
                      
                      return {
                        ...annotation,
                        allReviews: updatedReviews,
                        overallRating: Number(avgOverall.toFixed(1)),
                        parkingRating: Number(avgParking.toFixed(1)),
                        tipRating: Number(avgTip.toFixed(1)),
                        hasDog: hasAnyDog,
                        noTip: hasAnyNoTip,
                        reviews: updatedReviews.length,
                        notes: newReview.notes,
                        createdAt: '刚刚',
                        author: newReview.author
                      };
                    }
                    return annotation;
                  }));

                  // 显示成功提示
                  const tempDiv = document.createElement('div');
                  tempDiv.innerHTML = `
                    <div style="position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background: #22c55e; color: white; padding: 12px 20px; border-radius: 8px; z-index: 9999; font-family: Inter, sans-serif; font-size: 14px; animation: slideDown 0.3s ease-out;">
                      ✅ 评价已成功添加！
                    </div>
                  `;
                  document.body.appendChild(tempDiv);
                  
                  setTimeout(() => {
                    if (document.body.contains(tempDiv)) {
                      document.body.removeChild(tempDiv);
                    }
                  }, 3000);

                  setShowAddReviewModal(false);
                  setCurrentAnnotationForNewReview(null);
                  setAnnotationForm({
                    parkingRating: 5,
                    hasDog: false,
                    tipRating: 5,
                    noTip: false,
                    overallRating: 5,
                    notes: '',
                    title: ''
                  });
                }}
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
              >
                发布评价
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 会员订阅弹窗 */}
      {showMembershipModal && (
        <div 
          className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowMembershipModal(false);
            }
          }}
        >
          <div className="bg-white rounded-2xl p-4 sm:p-6 max-w-xs sm:max-w-md w-full shadow-2xl relative mx-4 sm:mx-0">
            <button
              onClick={() => setShowMembershipModal(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-content mx-auto mb-4">
                <span className="text-white text-2xl font-bold">👑</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {membershipStatus.isPremium ? 'DDmap 会员中心' : 'DDmap 会员特权'}
              </h3>
              <p className="text-sm text-gray-600">
                {membershipStatus.isPremium ? '管理您的会员权益' : '升级会员，解锁更多司机专属功能'}
              </p>
            </div>

            {membershipStatus.isPremium ? (
              /* 会员用户界面 */
              <div>
                <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl p-4 mb-6 border border-yellow-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-600 text-lg">👑</span>
                      <span className="font-semibold text-yellow-800">{membershipStatus.plan === 'yearly' ? '年度会员' : '月度会员'}</span>
                    </div>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      已激活
                    </span>
                  </div>
                  <div className="text-sm text-yellow-700 space-y-1">
                    <p>订阅日期: {membershipStatus.subscribedDate || '2024-01-01'}</p>
                    <p>到期日期: {membershipStatus.expiryDate || '2024-12-31'}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <h4 className="font-semibold text-gray-900 text-sm">会员特权</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-sm">
                      <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 text-xs">✓</span>
                      </span>
                      <span>无限制保存黑名单地址</span>
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">已解锁</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 text-xs">✓</span>
                      </span>
                      <span>附近零小费地址预警</span>
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">已解锁</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 text-xs">✓</span>
                      </span>
                      <span>自定义预警范围 (1-50公里)</span>
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">已解锁</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 text-xs">✓</span>
                      </span>
                      <span>优先客服支持</span>
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">已解锁</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <h5 className="font-semibold text-gray-900 text-sm mb-2">使用统计</h5>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{blacklistAddresses.length}</div>
                      <div className="text-gray-600">黑名单地址</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{favoriteGroups.reduce((sum, group) => sum + group.count, 0)}</div>
                      <div className="text-gray-600">收藏地址</div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowMembershipModal(false)}
                  className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  关闭
                </button>
              </div>
            ) : (
              /* 非会员用户界面 */
              <div>
                <div className="space-y-4 mb-6">
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <h4 className="font-semibold text-red-800 text-sm mb-2 flex items-center gap-2">
                      <span>⚠️</span>
                      <span>免费用户限制</span>
                    </h4>
                    <div className="text-sm text-red-700 space-y-1">
                      <p>• 黑名单地址: {blacklistAddresses.length}/5 (已达限制)</p>
                      <p>• 无法查看附近零小费地址预警</p>
                      <p>• 标准客服支持</p>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <h4 className="font-semibold text-yellow-800 text-sm mb-3 flex items-center gap-2">
                      <span>👑</span>
                      <span>会员专享特权</span>
                    </h4>
                    <div className="space-y-2 text-sm text-yellow-700">
                      <div className="flex items-center gap-2">
                        <span className="text-green-600">✓</span>
                        <span>无限制保存黑名单地址</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-600">✓</span>
                        <span>附近零小费地址实时预警</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-600">✓</span>
                        <span>自定义预警范围设置</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-600">✓</span>
                        <span>优先客服支持</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <h4 className="font-semibold text-gray-900 text-sm">选择订阅方案</h4>
                  <div className="space-y-3">
                    <div className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors cursor-pointer"
                         onClick={() => {
                           setMembershipStatus({
                             isPremium: true,
                             subscribedDate: new Date().toLocaleDateString(),
                             expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
                             plan: 'monthly'
                           });
                           setShowMembershipModal(false);
                         }}>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-gray-900">月度会员</div>
                          <div className="text-sm text-gray-600">按月订阅，随时取消</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-gray-900">¥19</div>
                          <div className="text-sm text-gray-500">/月</div>
                        </div>
                      </div>
                    </div>

                    <div className="border-2 border-yellow-300 bg-yellow-50 rounded-xl p-4 hover:border-yellow-400 transition-colors cursor-pointer relative"
                         onClick={() => {
                           setMembershipStatus({
                             isPremium: true,
                             subscribedDate: new Date().toLocaleDateString(),
                             expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString(),
                             plan: 'yearly'
                           });
                           setShowMembershipModal(false);
                         }}>
                      <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        省50%
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-gray-900">年度会员</div>
                          <div className="text-sm text-gray-600">一次性付费，享受最大优惠</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-gray-900">¥99</div>
                          <div className="text-sm text-gray-500">
                            <span className="line-through text-gray-400">¥228</span> /年
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center text-xs text-gray-500 mb-4">
                  点击订阅方案即可立即开通会员 (演示模式)
                </div>

                <button
                  onClick={() => setShowMembershipModal(false)}
                  className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  稍后再说
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 附近零小费地址查看弹窗 */}
      {showNearbyBlacklistModal && membershipStatus.isPremium && (
        <div 
          className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowNearbyBlacklistModal(false);
            }
          }}
        >
          <div className="bg-white rounded-2xl p-4 sm:p-6 max-w-sm sm:max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative mx-4 sm:mx-0">
            <button
              onClick={() => setShowNearbyBlacklistModal(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-600 text-2xl">🚫</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">零小费地址警报</h3>
              <p className="text-sm text-gray-600">查看您附近的零小费地址，提前避雷</p>
            </div>

            {/* 距离设置 */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <h4 className="font-semibold text-gray-900 text-sm mb-3">预警范围设置</h4>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-700">搜索半径:</span>
                <div className="flex items-center gap-2">
                  {[3, 5, 8, 10, 15].map(distance => (
                    <button
                      key={distance}
                      onClick={() => setNearbyRadius(distance)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        nearbyRadius === distance
                          ? 'bg-red-500 text-white'
                          : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      {distance}km
                    </button>
                  ))}
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                会员专享: 自定义1-50公里预警范围
              </div>
            </div>

            {/* 零小费地址列表 */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 text-sm mb-3 flex items-center gap-2">
                <span>🚨</span>
                <span>附近 {nearbyRadius}km 内零小费地址</span>
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                  {getNearbyBlacklistAddresses(49.2827, -123.1207, nearbyRadius).length} 个
                </span>
              </h4>

              <div className="space-y-3">
                {getNearbyBlacklistAddresses(49.2827, -123.1207, nearbyRadius).length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">🎉</div>
                    <p className="text-sm">太棒了！附近 {nearbyRadius}km 内暂无零小费地址</p>
                  </div>
                ) : (
                  getNearbyBlacklistAddresses(49.2827, -123.1207, nearbyRadius).map(annotation => {
                    const distance = calculateDistance(49.2827, -123.1207, annotation.lat, annotation.lng);
                    return (
                      <div key={annotation.id} className="bg-red-50 border border-red-200 rounded-xl p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h5 className="font-semibold text-red-900 text-sm">{annotation.title}</h5>
                            <p className="text-xs text-red-600 mt-1">{annotation.address}</p>
                          </div>
                          <div className="text-right">
                            <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                              {distance.toFixed(1)}km
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-red-200 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                            🚫 零小费
                          </span>
                          <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                            ⭐ {annotation.overallRating.toFixed(1)}
                          </span>
                          {annotation.hasDog && (
                            <span className="bg-orange-200 text-orange-800 px-2 py-1 rounded-full text-xs">
                              🐕 有恶犬
                            </span>
                          )}
                        </div>
                        
                        <p className="text-xs text-gray-700 bg-white rounded-lg p-2">
                          💭 {annotation.notes}
                        </p>
                        
                        <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                          <span>by {annotation.author}</span>
                          <span>{annotation.createdAt}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowNearbyBlacklistModal(false)}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                关闭
              </button>
              <button
                onClick={() => {
                  // 刷新数据
                  setShowNearbyBlacklistModal(false);
                  setTimeout(() => setShowNearbyBlacklistModal(true), 100);
                }}
                className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
              >
                🔄 刷新位置
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;