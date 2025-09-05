/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_MAPS_API_KEY: string
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_VERSION: string
  readonly VITE_APP_ENV: string
  readonly VITE_API_BASE_URL?: string
  readonly VITE_GA_MEASUREMENT_ID?: string
  readonly VITE_SENTRY_DSN?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Global declarations for Google Maps
declare global {
  interface Window {
    favoriteAnnotation: (annotationId: any) => void;
    favoriteAnnotationQuick: (annotationId: any) => void;
    likeAnnotation: (annotationId: any) => void;
    showAllReviews: (annotationId: any) => void;
    addNewReview: (annotationId: any) => void;
    closeInfoWindow: () => void;
    addToBlacklist: (annotationId: any) => void;
    currentDetailInfoWindow: any;
    currentHoverTooltip: any;
  }
  
  namespace google {
    namespace maps {
      class Map {
        constructor(mapDiv: Element | null, opts?: any);
        setCenter(latLng: any): void;
        setZoom(zoom: number): void;
      }
      
      class LatLng {
        constructor(lat: number, lng: number);
        lat(): number;
        lng(): number;
      }
      
      class Marker {
        constructor(opts?: any);
        setMap(map: Map | null): void;
        setPosition(latLng: LatLng): void;
        addListener(eventName: string, handler: Function): void;
      }
      
      class InfoWindow {
        constructor(opts?: any);
        open(map: Map, anchor?: Marker): void;
        close(): void;
        setContent(content: string): void;
      }
      
      namespace places {
        class Autocomplete {
          constructor(input: HTMLInputElement, opts?: any);
          addListener(eventName: string, handler: Function): void;
          getPlace(): any;
        }
        
        class PlacesService {
          constructor(map: Map);
          getDetails(request: any, callback: Function): void;
          nearbySearch(request: any, callback: Function): void;
          textSearch(request: any, callback: Function): void;
        }
        
        enum PlacesServiceStatus {
          OK = 'OK'
        }
      }
    }
  }
}

export {};