'use client';

import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, MapPinIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import axios from 'axios';
import LocaleSwitcher from '@/components/LocaleSwitcher';
import { useTranslations } from 'next-intl';

interface City {
  id: number;
  city: string;
  lat: number;
  lng: number;
}

interface HeaderProps {
  onLoginClick: () => void;
  userLocation: { lat: number; lng: number; address: string } | null;
  onLocationChange: (location: { lat: number; lng: number; address: string }) => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function Header({ onLoginClick, userLocation, onLocationChange }: HeaderProps) {
  const t = useTranslations('IndexPage');
  const [cities, setCities] = useState<City[]>([]);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      const response = await axios.get<City[]>(`${API_URL}/api/cities`);
      setCities(response.data);
    } catch (error) {
      console.error('Failed to fetch cities:', error);
    }
  };

  const handleCitySelect = (city: City) => {
    onLocationChange({ lat: city.lat, lng: city.lng, address: city.city });
    setShowCityDropdown(false);
  };

  const filteredCities = cities.filter(city => 
    city?.city?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="sticky top-0 z-10 bg-white/80 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between p-4">
        <div className="flex items-center gap-8 pr-8">
          <a href="#" className="text-2xl font-bold text-gray-900">
            <Image src="/images/logo2.svg" width="130" height="28" alt="" />
          </a>
          <nav className="hidden gap-6 md:flex">
            <a href="#" className="text-sm font-semibold text-gray-600 hover:text-gray-900">
              {t('serviceACRepair')}
            </a>
            <a href="#" className="text-sm font-semibold text-gray-600 hover:text-gray-900">
              {t('serviceApplianceRepair')}
            </a>
            <a href="#" className="text-sm font-semibold text-gray-600 hover:text-gray-900">
              {t('serviceCleaning')}
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {/* Service Search Box */}
          <div className="relative hidden md:block">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search services..."
              className="w-64 pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:border-gray-400 focus:shadow-md focus:outline-none"
            />
          </div>

          {/* City Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowCityDropdown(!showCityDropdown)}
              className="flex items-center space-x-2 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:border-gray-300 focus:border-gray-400 focus:shadow-md focus:outline-none"
            >
              <MapPinIcon className="h-4 w-4 text-gray-500" />
              <span className="text-gray-700">
                {userLocation?.address || 'Select City'}
              </span>
              <ChevronDownIcon className="h-4 w-4 text-gray-500" />
            </button>

            {showCityDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                <div className="p-3 border-b">
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search cities..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:border-gray-400 focus:shadow-md focus:outline-none"
                    />
                  </div>
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {filteredCities.map((city) => (
                    <button
                      key={city.id}
                      onClick={() => handleCitySelect(city)}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 focus:bg-gray-50"
                    >
                      {city.city}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <LocaleSwitcher />
          <button
            type="button"
            onClick={onLoginClick}
            className="rounded-md bg-[#00A2B5] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#008C9E]"
          >
            {t('loginSignup')}
          </button>
        </div>
      </div>
    </header>
  );
}