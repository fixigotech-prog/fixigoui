'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon, MapPinIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

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

  useEffect(() => {
    if (isOpen) {
      fetchCities();
    }
  }, [isOpen]);

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

  const handleConfirm = () => {
    const city = cities.find(c => c.city === selectedCity);
    if (city) {
      onLocationSelect({ lat: city.lat, lng: city.lng, address: city.city });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-md mx-4 bg-white rounded-lg shadow-xl">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-2">
            <MapPinIcon className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Select Your City</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
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
            disabled={!selectedCity}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm City
          </button>
        </div>
      </div>
    </div>
  );
}