'use client';

import { useState, useEffect, useRef } from 'react';
import { XMarkIcon, MapPinIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
}

interface City {
  id: number;
  city: string;
  lat: number;
  lng: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function LocationModal({ isOpen, onClose, onLocationSelect }: LocationModalProps) {
  const [cities, setCities] = useState<City[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    if (isOpen) {
      fetchCities();
      loadGoogleMaps();
      // Auto-detect location when modal opens
      setTimeout(() => {
        getCurrentLocation();
      }, 1000);
    }
  }, [isOpen]);

  useEffect(() => {
    if (showMap && mapRef.current && window.google) {
      initializeMap();
    }
  }, [showMap]);

  useEffect(() => {
    const filtered = cities.filter(city => 
      city?.city?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCities(filtered);
  }, [searchQuery, cities]);

  const fetchCities = async () => {
    setLoading(true);
    try {
      const response = await axios.get<City[]>(`${API_URL}/api/cities`);
      setCities(response.data);
      setFilteredCities(response.data);
    } catch (error) {
      console.error('Failed to fetch cities:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadGoogleMaps = () => {
    if (window.google) return;
    
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    document.head.appendChild(script);
  };

  const initializeMap = () => {
    if (!mapRef.current || !window.google) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: 28.6139, lng: 77.2090 }, // Delhi center
      zoom: 10,
    });

    mapInstance.current = map;

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
            });
          }
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const handleConfirm = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation);
      onClose();
    } else {
      const city = cities.find(c => c.city === selectedCity);
      if (city) {
        onLocationSelect({ lat: city.lat, lng: city.lng, address: city.city });
        onClose();
      }
    }
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
          <div className="flex space-x-2 mb-4">
            <button
              onClick={() => setShowMap(false)}
              className={`px-4 py-2 text-sm font-medium rounded-lg ${
                !showMap ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              Select City
            </button>
            <button
              onClick={() => setShowMap(true)}
              className={`px-4 py-2 text-sm font-medium rounded-lg ${
                showMap ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              Use Map
            </button>
          </div>

          {!showMap ? (
            <>
              <p className="text-sm text-gray-600 mb-4">
                Choose your city to get accurate service availability and pricing.
              </p>
              
              <div className="relative mb-4">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search cities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:border-gray-400 focus:shadow-md focus:outline-none"
                />
              </div>
              
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-600">Loading cities...</span>
                  </div>
                ) : filteredCities.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">No cities found</p>
                ) : (
                  filteredCities.map((city) => (
                    <button
                      key={city.id}
                      onClick={() => setSelectedCity(city.city)}
                      className={`w-full p-3 text-left rounded-lg border transition-colors ${
                        selectedCity === city.city
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                      }`}
                    >
                      {city.city}
                    </button>
                  ))
                )}
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-gray-600">
                  {selectedLocation ? 'Drag the marker or click elsewhere to change location' : 'Detecting your location...'}
                </p>
                <button
                  onClick={getCurrentLocation}
                  className="px-3 py-1 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1"
                >
                  📍 Detect Location
                </button>
              </div>
              
              <div ref={mapRef} className="w-full h-96 rounded-lg border"></div>
              
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
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-900">Selected Location:</p>
                  <p className="text-xs text-blue-700">{selectedLocation.address}</p>
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex items-center justify-end space-x-3 p-6 border-t bg-gray-50 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Skip for now
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedCity && !selectedLocation}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm Location
          </button>
        </div>
      </div>
    </div>
  );
}