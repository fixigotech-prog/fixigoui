'use client';

import { useState, useEffect, useRef } from 'react';
import { XMarkIcon, MapPinIcon } from '@heroicons/react/24/outline';

declare global {
  interface Window {
    google: any;
    initMap: () => void;
    googleMapsLoaded?: boolean;
  }
}

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
}

// Cache for Google Maps script loading
let googleMapsPromise: Promise<void> | null = null;

export default function LocationModal({ isOpen, onClose, onLocationSelect }: LocationModalProps) {
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [hasSkippedBefore, setHasSkippedBefore] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    if (isOpen) {
      // Check if user has skipped location before
      const skipped = localStorage.getItem('locationSkipped');
      setHasSkippedBefore(skipped === 'true');
      
      loadGoogleMaps().then(() => {
        if (mapRef.current) {
          initializeMap();
          // Auto-detect location when modal opens
          setTimeout(() => {
            getCurrentLocation();
          }, 500);
        }
      });
    }
  }, [isOpen]);



  const loadGoogleMaps = (): Promise<void> => {
    if (window.google && window.googleMapsLoaded) {
      return Promise.resolve();
    }
    
    if (googleMapsPromise) {
      return googleMapsPromise;
    }
    
    googleMapsPromise = new Promise((resolve, reject) => {
      if (window.google) {
        window.googleMapsLoaded = true;
        resolve();
        return;
      }
      
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.onload = () => {
        window.googleMapsLoaded = true;
        resolve();
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
    
    return googleMapsPromise;
  };

  const initializeMap = () => {
    if (!mapRef.current || !window.google) return;

    setLoading(true);
    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: 28.6139, lng: 77.2090 }, // Delhi center
      zoom: 10,
      zoomControl: true,
      scrollwheel: true,
      disableDoubleClickZoom: false,
      gestureHandling: 'auto',
    });

    mapInstance.current = map;
    
    // Set loading to false when map is ready
    map.addListener('idle', () => {
      setLoading(false);
    });

    map.addListener('click', (event: any) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }

      markerRef.current = new window.google.maps.Marker({
        position: { lat, lng },
        map: map,
        draggable: true,
        animation: window.google.maps.Animation.DROP,
      });

      // Allow marker to be dragged
      markerRef.current.addListener('dragend', (event: any) => {
        const newLat = event.latLng.lat();
        const newLng = event.latLng.lng();
        
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: { lat: newLat, lng: newLng } }, (results: any, status: any) => {
          if (status === 'OK' && results[0]) {
            setSelectedLocation({ lat: newLat, lng: newLng, address: results[0].formatted_address });
          }
        });
      });

      // Reverse geocoding to get address
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results: any, status: any) => {
        if (status === 'OK' && results[0]) {
          setSelectedLocation({ lat, lng, address: results[0].formatted_address });
        }
      });
    });
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          if (mapInstance.current) {
            mapInstance.current.setCenter({ lat, lng });
            mapInstance.current.setZoom(15);
            
            if (markerRef.current) {
              markerRef.current.setMap(null);
            }

            markerRef.current = new window.google.maps.Marker({
              position: { lat, lng },
              map: mapInstance.current,
              draggable: true,
              animation: window.google.maps.Animation.DROP,
            });

            // Allow marker to be dragged
            markerRef.current.addListener('dragend', (event: any) => {
              const newLat = event.latLng.lat();
              const newLng = event.latLng.lng();
              
              const geocoder = new window.google.maps.Geocoder();
              geocoder.geocode({ location: { lat: newLat, lng: newLng } }, (results: any, status: any) => {
                if (status === 'OK' && results[0]) {
                  setSelectedLocation({ lat: newLat, lng: newLng, address: results[0].formatted_address });
                }
              });
            });

            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ location: { lat, lng } }, (results: any, status: any) => {
              if (status === 'OK' && results[0]) {
                setSelectedLocation({ lat, lng, address: results[0].formatted_address });
              }
              setLoading(false);
            });
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          setLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
      );
    }
  };

  const handleConfirm = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation);
      // Clear skip flag when location is selected
      localStorage.removeItem('locationSkipped');
      onClose();
    }
  };

  const handleSkip = () => {
    // Mark that user has skipped location
    localStorage.setItem('locationSkipped', 'true');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-2">
            <MapPinIcon className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Select Your City</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-600">
              {selectedLocation ? 'Drag the marker or click elsewhere to change location' : 'Detecting your location...'}
            </p>
            <button
              onClick={getCurrentLocation}
              className="px-3 py-1 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1"
              disabled={loading}
            >
              {loading ? '⏳' : '📍'} Detect Location
            </button>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Loading map...</p>
              </div>
            </div>
          ) : (
            <div ref={mapRef} className="w-full h-96 rounded-lg border"></div>
          )}
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-blue-900">Instructions:</p>
            <ul className="text-xs text-blue-700 mt-1 space-y-1">
              <li>• Click anywhere on the map to set your location</li>
              <li>• Drag the map to explore different areas</li>
              <li>• Use zoom controls to get more precise location</li>
              <li>• The red marker shows your selected location</li>
            </ul>
          </div>
          
          {selectedLocation && (
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <p className="text-sm font-medium text-green-900">Selected Location:</p>
              <p className="text-xs text-green-700">{selectedLocation.address}</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end space-x-3 p-6 border-t bg-gray-50 rounded-b-lg">
          <button
            onClick={handleSkip}
            disabled={hasSkippedBefore}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {hasSkippedBefore ? 'Location Required' : 'Skip for now'}
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedLocation}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm Location
          </button>
        </div>
      </div>
    </div>
  );
}