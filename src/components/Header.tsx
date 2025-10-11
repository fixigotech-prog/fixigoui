'use client';

import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, MapPinIcon, ChevronDownIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <header className="sticky top-0 left-0 right-0 z-10 bg-white/80 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center">
          <a href="#" className="flex-shrink-0">
            <Image src="/images/logo/logo.png" width={100} height={25} alt="Logo" className="sm:w-[120px] sm:h-[30px]" />
          </a>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center justify-center flex-1 mx-8">
          <nav className="flex gap-6">
            <a href="#" className="text-sm font-semibold text-gray-600 hover:text-gray-900 whitespace-nowrap">
              {t('serviceACRepair')}
            </a>
            <a href="#" className="text-sm font-semibold text-gray-600 hover:text-gray-900 whitespace-nowrap">
              {t('serviceApplianceRepair')}
            </a>
            <a href="#" className="text-sm font-semibold text-gray-600 hover:text-gray-900 whitespace-nowrap">
              {t('serviceCleaning')}
            </a>
          </nav>
        </div>

        {/* Desktop Right Section */}
        <div className="hidden md:flex items-center gap-2">
          {/* Search Box - Desktop only */}
          <div className="relative hidden xl:block">
            <MagnifyingGlassIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-48 pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none"
            />
          </div>

          {/* City Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowCityDropdown(!showCityDropdown)}
              className="flex items-center space-x-1 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:border-gray-300 focus:border-gray-400 focus:outline-none"
            >
              <MapPinIcon className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700 max-w-20 truncate hidden sm:block">
                {userLocation?.address || 'City'}
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
                      className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none"
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
            className="rounded-lg bg-[#00A2B5] px-4 py-2 text-sm font-semibold text-white hover:bg-[#008C9E] whitespace-nowrap"
          >
            {t('loginSignup')}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          {/* Mobile City Selector */}
          <div className="relative">
            <button
              onClick={() => setShowCityDropdown(!showCityDropdown)}
              className="flex items-center p-2 border border-gray-200 rounded-lg"
            >
              <MapPinIcon className="h-4 w-4 text-gray-500" />
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
                      className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none"
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
          
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            {isMobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-3 space-y-3">
            {/* Mobile Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search services..."
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none"
              />
            </div>
            
            {/* Mobile Navigation */}
            <nav className="space-y-2">
              <a href="#" className="block py-2 text-sm font-semibold text-gray-600 hover:text-gray-900">
                {t('serviceACRepair')}
              </a>
              <a href="#" className="block py-2 text-sm font-semibold text-gray-600 hover:text-gray-900">
                {t('serviceApplianceRepair')}
              </a>
              <a href="#" className="block py-2 text-sm font-semibold text-gray-600 hover:text-gray-900">
                {t('serviceCleaning')}
              </a>
            </nav>
            
            {/* Mobile Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <LocaleSwitcher />
              <button
                type="button"
                onClick={() => {
                  onLoginClick();
                  setIsMobileMenuOpen(false);
                }}
                className="rounded-lg bg-[#00A2B5] px-4 py-2 text-sm font-semibold text-white hover:bg-[#008C9E]"
              >
                {t('loginSignup')}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}