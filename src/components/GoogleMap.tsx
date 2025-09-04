import React, { useEffect, useRef, useState } from 'react';
import { googleMapsService, LatLng } from '../utils/googleMaps';
import { useTranslation } from '../hooks/useTranslation';

interface GoogleMapProps {
  center?: LatLng;
  onLocationSelect?: (location: LatLng, address: string) => void;
  annotations?: Array<{
    id: string;
    location: LatLng;
    title: string;
    description?: string;
  }>;
  height?: string;
}

const GoogleMap: React.FC<GoogleMapProps> = ({
  center,
  onLocationSelect,
  annotations = [],
  height = '400px'
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<LatLng | null>(null);
  const { t } = useTranslation();

  // 默认中心点 (Toronto, Canada)
  const defaultCenter: LatLng = { lat: 43.6532, lng: -79.3832 };

  useEffect(() => {
    if (!mapRef.current) return;

    const initializeMap = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // 获取用户当前位置
        let mapCenter = center || defaultCenter;
        try {
          const userLocation = await googleMapsService.getCurrentLocation();
          mapCenter = userLocation;
          setCurrentLocation(userLocation);
        } catch (locationError) {
          console.warn('Could not get user location, using default center');
        }

        // 初始化地图
        const map = await googleMapsService.initialize(mapRef.current!, mapCenter);

        // 如果有回调函数，添加点击事件监听器
        if (onLocationSelect) {
          map.addListener('click', async (event: google.maps.MapMouseEvent) => {
            if (event.latLng) {
              const location = {
                lat: event.latLng.lat(),
                lng: event.latLng.lng()
              };

              try {
                const address = await googleMapsService.reverseGeocode(location);
                onLocationSelect(location, address);
              } catch (error) {
                console.error('Failed to get address:', error);
                onLocationSelect(location, 'Unknown address');
              }
            }
          });
        }

        // 添加当前位置标记
        if (currentLocation) {
          googleMapsService.createMarker(currentLocation, {
            title: t('map.currentLocation') || 'Current Location',
            icon: {
              url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iNCIgZmlsbD0iIzAwN2NmZiIvPgo8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI4IiBzdHJva2U9IiMwMDdjZmYiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMyIvPgo8L3N2Zz4K',
              scaledSize: new google.maps.Size(24, 24),
              anchor: new google.maps.Point(12, 12)
            }
          });
        }

        // 添加标注标记
        annotations.forEach((annotation) => {
          const marker = googleMapsService.createMarker(annotation.location, {
            title: annotation.title,
            icon: {
              url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE2IDJDMTEuMDMgMiA3IDE2IDcgMTZTMTEuMDMgMzAgMTYgMzBTMjUgMjIgMjUgMTZTMjAuOTcgMiAxNiAyWiIgZmlsbD0iI2VmNDQ0NCIvPgo8Y2lyY2xlIGN4PSIxNiIgY3k9IjEyIiByPSI0IiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K',
              scaledSize: new google.maps.Size(32, 32),
              anchor: new google.maps.Point(16, 30)
            }
          });

          if (marker && annotation.description) {
            googleMapsService.createInfoWindow(
              `<div><h3>${annotation.title}</h3><p>${annotation.description}</p></div>`,
              marker
            );
          }
        });

        setIsLoading(false);
      } catch (error) {
        console.error('Failed to initialize map:', error);
        setError('Failed to load map. Please check your internet connection and try again.');
        setIsLoading(false);
      }
    };

    initializeMap();
  }, [center, onLocationSelect, annotations, t, currentLocation]);

  if (error) {
    return (
      <div 
        className="flex items-center justify-center bg-gray-100 rounded-lg"
        style={{ height }}
      >
        <div className="text-center p-4">
          <p className="text-red-600 mb-2">⚠️ Map Error</p>
          <p className="text-sm text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-lg overflow-hidden border border-gray-300">
      {isLoading && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10"
          style={{ height }}
        >
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
      
      <div
        ref={mapRef}
        style={{ height, width: '100%' }}
        className="bg-gray-100"
      />
      
      {onLocationSelect && !isLoading && (
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-2 text-xs text-gray-600 max-w-xs">
          📍 {t('map.clickToAnnotate') || 'Click on the map to add an annotation'}
        </div>
      )}
    </div>
  );
};

export default GoogleMap;