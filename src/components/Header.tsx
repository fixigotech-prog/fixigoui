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
    <header className="sticky top-0 left-0 right-0 z-10 pl-10 pr-10 bg-white/80 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex items-center justify-between px-1 py-4 max-w-full">
        <div className="flex items-center pl-2">
          <a href="#" className="text-2xl font-bold text-gray-900">
            <Image src="/images/logo/logo.png" width="120" height="30" alt="" />
          </a>
        </div>
        
        <div className="flex items-center justify-center flex-1 ">
          <nav className="hidden gap-4 md:flex">
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

        <div className="flex items-center gap-2 pr-2">
          {/* Service Search Box */}
          <div className="relative hidden lg:block">
            <MagnifyingGlassIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-48 pl-7 pr-2 py-1 text-xs border border-gray-200 rounded focus:border-gray-400 focus:outline-none"
            />
          </div>

          {/* City Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowCityDropdown(!showCityDropdown)}
              className="flex items-center space-x-1 px-1 py-1 text-xs border border-gray-200 rounded hover:border-gray-300 focus:border-gray-400 focus:outline-none"
            >
              <MapPinIcon className="h-3 w-5 text-gray-500" />
              <span className="text-xs text-gray-700 max-w-24 truncate">
                {userLocation?.address || 'Select City'}
              </span>
              <ChevronDownIcon className="h-3 w-3 text-gray-500" />
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
                      className="w-72 pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:border-gray-400 focus:shadow-md focus:outline-none"
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
            className="rounded bg-[#00A2B5] px-3 py-1 text-xs font-semibold text-white hover:bg-[#008C9E]"
          >
            {t('loginSignup')}
          </button>
        </div>
      </div>
    </header>
  );
}