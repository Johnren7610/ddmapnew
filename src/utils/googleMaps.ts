import { Loader } from '@googlemaps/js-api-loader';

// 你需要在Google Cloud Console获取API密钥
// https://console.cloud.google.com/apis/credentials
const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY';

const loader = new Loader({
  apiKey: GOOGLE_MAPS_API_KEY,
  version: 'weekly',
  libraries: ['places', 'geometry']
});

export interface LatLng {
  lat: number;
  lng: number;
}

export interface AddressInfo {
  address: string;
  location: LatLng;
  placeId?: string;
}

class GoogleMapsService {
  private map: google.maps.Map | null = null;
  private geocoder: google.maps.Geocoder | null = null;
  private placesService: google.maps.places.PlacesService | null = null;

  async initialize(mapElement: HTMLElement, center: LatLng): Promise<google.maps.Map> {
    await loader.load();
    
    this.map = new google.maps.Map(mapElement, {
      center,
      zoom: 13,
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true,
      zoomControl: true,
      gestureHandling: 'cooperative'
    });

    this.geocoder = new google.maps.Geocoder();
    this.placesService = new google.maps.places.PlacesService(this.map);

    return this.map;
  }

  getMap(): google.maps.Map | null {
    return this.map;
  }

  // 地址转坐标
  async geocodeAddress(address: string): Promise<AddressInfo[]> {
    if (!this.geocoder) {
      throw new Error('Geocoder not initialized');
    }

    return new Promise((resolve, reject) => {
      this.geocoder!.geocode({ address }, (results, status) => {
        if (status === 'OK' && results) {
          const addressInfos: AddressInfo[] = results.map(result => ({
            address: result.formatted_address,
            location: {
              lat: result.geometry.location.lat(),
              lng: result.geometry.location.lng()
            },
            placeId: result.place_id
          }));
          resolve(addressInfos);
        } else {
          reject(new Error(`Geocoding failed: ${status}`));
        }
      });
    });
  }

  // 坐标转地址
  async reverseGeocode(location: LatLng): Promise<string> {
    if (!this.geocoder) {
      throw new Error('Geocoder not initialized');
    }

    return new Promise((resolve, reject) => {
      this.geocoder!.geocode({ location }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          resolve(results[0].formatted_address);
        } else {
          reject(new Error(`Reverse geocoding failed: ${status}`));
        }
      });
    });
  }

  // 获取用户当前位置
  async getCurrentLocation(): Promise<LatLng> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    });
  }

  // 创建标记
  createMarker(
    location: LatLng,
    options?: {
      title?: string;
      icon?: string | google.maps.Icon;
      draggable?: boolean;
      onClick?: () => void;
    }
  ): google.maps.Marker | null {
    if (!this.map) return null;

    const marker = new google.maps.Marker({
      position: location,
      map: this.map,
      title: options?.title,
      icon: options?.icon,
      draggable: options?.draggable || false
    });

    if (options?.onClick) {
      marker.addListener('click', options.onClick);
    }

    return marker;
  }

  // 创建信息窗口
  createInfoWindow(
    content: string | HTMLElement,
    marker?: google.maps.Marker
  ): google.maps.InfoWindow {
    const infoWindow = new google.maps.InfoWindow({
      content
    });

    if (marker) {
      marker.addListener('click', () => {
        infoWindow.open(this.map, marker);
      });
    }

    return infoWindow;
  }

  // 搜索附近的地点
  async searchNearbyPlaces(
    location: LatLng,
    radius: number,
    types: string[]
  ): Promise<google.maps.places.PlaceResult[]> {
    if (!this.placesService) {
      throw new Error('Places service not initialized');
    }

    return new Promise((resolve, reject) => {
      const request = {
        location,
        radius,
        types
      };

      this.placesService!.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          resolve(results);
        } else {
          reject(new Error(`Places search failed: ${status}`));
        }
      });
    });
  }
}

export const googleMapsService = new GoogleMapsService();