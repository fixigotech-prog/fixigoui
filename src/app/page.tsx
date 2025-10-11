'use client';

import {useEffect, useState} from 'react';
import Footer from '@/components/Footer';
import LocationModal from '@/components/LocationModal';
import Header from '@/components/Header';
import HeroSection from '@/components/sections/HeroSection';
import OffersSection from '@/components/sections/OffersSection';
import FrequentServicesSection from '@/components/sections/FrequentServicesSection';
import OurServicesSection from '@/components/sections/OurServicesSection';
import HowItWorksSection from '@/components/sections/HowItWorksSection';
import ServiceAreasSection from '@/components/sections/ServiceAreasSection';
import BenefitsSection from '@/components/sections/BenefitsSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import FAQSection from '@/components/sections/FAQSection';
import AuthModal from '@/components/AuthModal';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchOffers } from '@/store/slices/offersSlice';
import { fetchCategories } from '@/store/slices/categoriesSlice';
import { fetchCities } from '@/store/slices/locationSlice';
import { fetchFrequentServices } from '@/store/slices/frequentServicesSlice';
import { loadAuthFromStorage } from '@/store/slices/authSlice';
import Toast from '@/components/Toast';

export default function IndexPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' as 'success' | 'error', isVisible: false });
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);

  const dispatch = useAppDispatch();
  const { services: reduxFrequentServices } = useAppSelector(state => state.frequentServices);

  useEffect(() => {
    dispatch(loadAuthFromStorage());
    dispatch(fetchOffers());
    dispatch(fetchCategories());
    dispatch(fetchCities());
    dispatch(fetchFrequentServices());
    
    const savedLocation = localStorage.getItem('userLocation');
    if (!savedLocation) {
      setTimeout(() => setIsLocationModalOpen(true), 1000);
    } else {
      setUserLocation(JSON.parse(savedLocation));
    }
  }, [dispatch]);

  const handleLocationSelect = (location: { lat: number; lng: number; address: string }) => {
    setUserLocation(location);
    localStorage.setItem('userLocation', JSON.stringify(location));
  };

  const handleToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type, isVisible: true });
  };

  return (
    <div className="bg-gray-50">
      <Header 
        onLoginClick={() => setIsModalOpen(true)}
        userLocation={userLocation}
        onLocationChange={handleLocationSelect}
      />

      <HeroSection frequentServices={reduxFrequentServices} />
      <OffersSection />
      <OurServicesSection />
      <HowItWorksSection />
      <ServiceAreasSection />
      <BenefitsSection />
      <TestimonialsSection />
      <FAQSection />

      <LocationModal isOpen={isLocationModalOpen} onClose={() => setIsLocationModalOpen(false)} onLocationSelect={handleLocationSelect} />
      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onToast={handleToast} />
      
      <Footer />
      
      <Toast 
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
    </div>
  );
}