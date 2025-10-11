'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { TrashIcon, MapPinIcon, CalendarIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LocationModal from '@/components/LocationModal';
import Toast from '@/components/Toast';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAddressBook, addToAddressBook, fetchCitiesStates, setSelectedAddress } from '@/store/slices/bookingSlice';
import { fetchCities } from '@/store/slices/locationSlice';
import { setSelectedLocation } from '@/store/slices/locationSlice';

interface ServiceDetail {
  id: number;
  name: string;
  description: string;
  serviceId: number;
  lang: string;
  createdAt: string;
  updatedAt: string;
}

interface ServicePricing {
  id: number;
  price: number;
  term: string;
  termUnit: string;
  serviceId: number;
  lang: string;
  createdAt: string;
  updatedAt: string;
}

interface Service {
  id: number;
  categoryId: number;
  imageUrl: string;
  videoUrl: string;
  price: number;
  term: string;
  termUnit: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  details: ServiceDetail[];
  pricing: ServicePricing[];
}

interface CartItem {
  service: Service;
  quantity: number;
  selectedPricing: ServicePricing;
}

interface Promocode {
  id: number;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  expiryDate?: string;
  description?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function BookingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('category');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [promocodes, setPromocodes] = useState<Promocode[]>([]);
  const [selectedPromocode, setSelectedPromocode] = useState('');
  const [selectedTip, setSelectedTip] = useState(0);
  const [customTip, setCustomTip] = useState('');
  const [location, setLocation] = useState({ lat: 0, lng: 0, address: '' });
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [propertyDetails, setPropertyDetails] = useState({
    type: '' as 'apartment' | 'villa' | 'bungalow' | 'house' | 'office' | '',
    size: '' as 'Studio' | '1 BHK' | '2 BHK' | '3 BHK' | '4 BHK' | '5 BHK' | 'large' | 'extra_large' | 'Small Office' | 'Medium Office' | 'Large Office',
    notes: ''
  });

  const propertySize=['Studio','1 BHK', '2 BHK', '3 BHK', '4 BHK', '5 BHK','large', 'extra_large','Small Office','Medium Office','Large Office']
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCancellationPolicy, setShowCancellationPolicy] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [addressForm, setAddressForm] = useState({
    address: '',
    city: '',
    state: '',
    lat: 0,
    lng: 0
  });
  const [toast, setToast] = useState({ message: '', type: 'success' as 'success' | 'error', isVisible: false });
  
  const dispatch = useAppDispatch();
  const { addressBook, selectedAddress } = useAppSelector(state => state.booking);
  const { cities } = useAppSelector(state => state.location || { cities: [] });
  
  // Extract unique states from cities
  const states = cities ? [...new Set(cities.map(city => city.state))].filter(Boolean) : [];

  const tipOptions = [0, 50, 100, 150, 200];

  useEffect(() => {
    fetchServices();
    fetchPromocodes();
    loadCart();
    dispatch(fetchAddressBook());
    dispatch(fetchCities());
    
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      const parsedLocation = JSON.parse(savedLocation);
      setLocation(parsedLocation);
      setUserLocation(parsedLocation);
      setAddressForm({
        address: parsedLocation.address,
        city: '',
        state: '',
        lat: parsedLocation.lat,
        lng: parsedLocation.lng
      });
    } else {
      // Show location modal if no location is selected from index page
      setShowLocationModal(true);
    }
  }, [dispatch]);

  useEffect(() => {
    if (currentStep === 2 && categoryId) {
      fetchFilteredServices(categoryId);
    }
  }, [currentStep, categoryId]);

  useEffect(() => {
    saveCart();
  }, [cart]);

  const fetchServices = async () => {
    try {
      const response = await axios.get<Service[]>(`${API_URL}/api/services`);
      setServices(response.data.filter(service => service.isActive));
    } catch (err) {
      console.error('Failed to fetch services:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredServices = async (catId: string) => {
    try {
      setLoading(true);
      const response = await axios.get<Service[]>(`${API_URL}/api/services/filter/${catId}`);
      setFilteredServices(response.data.filter(service => service.isActive));
    } catch (err) {
      console.error('Failed to fetch filtered services:', err);
      setFilteredServices([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPromocodes = async () => {
    try {
      const response = await axios.get<Promocode[]>(`${API_URL}/api/promocodes`);
      setPromocodes(response.data);
    } catch (err) {
      console.error('Failed to fetch promocodes:', err);
    }
  };

  const saveCart = () => {
    sessionStorage.setItem('bookingCart', JSON.stringify(cart));
  };

  const loadCart = () => {
    const savedCart = sessionStorage.getItem('bookingCart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  };

  const getServiceName = (service: Service) => {
    const detail = service.details.find(d => d.lang === 'en') || service.details[0];
    return detail?.name || 'Unnamed Service';
  };

  const addToCart = (service: Service, pricing: ServicePricing) => {
    const existingItem = cart.find(item => 
      item.service.id === service.id && item.selectedPricing.id === pricing.id
    );

    if (existingItem) {
      setCart(cart.map(item =>
        item.service.id === service.id && item.selectedPricing.id === pricing.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { service, quantity: 1, selectedPricing: pricing }]);
    }
  };

  const removeFromCart = (serviceId: number, pricingId: number) => {
    setCart(cart.filter(item => 
      !(item.service.id === serviceId && item.selectedPricing.id === pricingId)
    ));
  };

  const getSubtotal = () => {
    return cart.reduce((total, item) => total + (item.selectedPricing.price * item.quantity), 0);
  };

  const getDiscount = () => {
    const promo = promocodes.find(p => p.code === selectedPromocode);
    if (!promo) return 0;
    
    const subtotal = getSubtotal();
    return promo.discountType === 'percentage' 
      ? (subtotal * promo.discountValue) / 100
      : promo.discountValue;
  };

  const getTipAmount = () => {
    return selectedTip === -1 ? (parseInt(customTip) || 0) : selectedTip;
  };

  const getTotal = () => {
    return getSubtotal() - getDiscount() + getTipAmount();
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      handleBooking();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleBooking = async () => {
    setIsSubmitting(true);
    try {
      for (const item of cart) {
        const booking = {
          userId: 1,
          serviceId: item.service.id,
          bookingDate: `${selectedDate}T${selectedTime}`,
          status: 'pending' as const,
          propertyType: propertyDetails.type || undefined,
          propertySize: propertyDetails.size || undefined,
          address: addressForm.address,
          tipAmount: getTipAmount(),
          notes: propertyDetails.notes,
          promocode: selectedPromocode || undefined
        };
        await axios.post(`${API_URL}/api/bookings`, booking);
      }
      setToast({ message: 'Booking created successfully!', type: 'success', isVisible: true });
      setCart([]);
      setCurrentStep(1);
    } catch (err) {
      console.error('Failed to create booking:', err);
      setToast({ message: 'Failed to create booking', type: 'error', isVisible: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1: return addressForm.address !== '' && addressForm.city !== '' && addressForm.state !== '';
      case 2: return cart.length > 0;
      case 3: return selectedDate !== '' && selectedTime !== '';
      case 4: return true;
      default: return false;
    }
  };

  const getPageTitle = () => {
    switch (currentStep) {
      case 1: return 'Set Location';
      case 2: return 'Select Services';
      case 3: return 'Schedule Booking';
      case 4: return 'Payment & Checkout';
      default: return 'Book Services';
    }
  };

  const getPageSubtitle = () => {
    switch (currentStep) {
      case 1: return 'Tell us where you need the service';
      case 2: return 'Choose from our professional services';
      case 3: return 'Pick your preferred date and time';
      case 4: return 'Complete your booking';
      default: return '';
    }
  };

  const handleLocationSelect = (location: { lat: number; lng: number; address: string }) => {
    setUserLocation(location);
    setLocation(location);
    setAddressForm({
      address: location.address,
      city: '',
      state: '',
      lat: location.lat,
      lng: location.lng
    });
    dispatch(setSelectedLocation(location));
    localStorage.setItem('userLocation', JSON.stringify(location));
    setShowLocationModal(false);
  };

  const handleAddressBookSelect = (address: any) => {
    setLocation({
      lat: address.lat,
      lng: address.lng,
      address: address.address
    });
    setAddressForm({
      address: address.address,
      city: address.city,
      state: address.state,
      lat: address.lat,
      lng: address.lng
    });
    dispatch(setSelectedAddress(address));
  };

  const handleSaveToAddressBook = async () => {
    if (addressForm.address && addressForm.city && addressForm.state) {
      await dispatch(addToAddressBook({
        address: addressForm.address,
        city: addressForm.city,
        state: addressForm.state,
        lat: addressForm.lat,
        lng: addressForm.lng
      }));
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-4">
              <MapPinIcon className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Set Your Location</h2>
            </div>
            
            {/* Address Book */}
            {addressBook && addressBook.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="font-medium text-gray-900 mb-3">Saved Addresses</h3>
                <div className="space-y-2">
                  {addressBook.map((addr) => (
                    <div
                      key={addr.id}
                      onClick={() => handleAddressBookSelect(addr)}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedAddress?.id === addr.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium text-sm">{addr.address}</div>
                      <div className="text-xs text-gray-500">{addr.city}, {addr.state}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-gray-900">Address Information</h3>
                  <button
                    onClick={() => setShowLocationModal(true)}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    📍 Use Map
                  </button>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Complete Address</label>
                  <textarea
                    value={addressForm.address}
                    onChange={(e) => setAddressForm({...addressForm, address: e.target.value})}
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your complete address"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <select
                      value={addressForm.city}
                      onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select City</option>
                      {cities && cities.length > 0 ? cities.map((city) => (
                        <option key={city.id} value={city.city}>
                          {city.city}
                        </option>
                      )) : (
                        <option disabled>No cities available</option>
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                    <select
                      value={addressForm.state}
                      onChange={(e) => setAddressForm({...addressForm, state: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select State</option>
                      {states && states.length > 0 ? states.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      )) : (
                        <option disabled>No states available</option>
                      )}
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                    <select
                      value={propertyDetails.type}
                      onChange={(e) => setPropertyDetails({...propertyDetails, type: e.target.value as any})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Type</option>
                      <option value="apartment">Apartment</option>
                      <option value="villa">Villa</option>
                      <option value="bungalow">Bungalow</option>
                      <option value="house">House</option>
                      <option value="office">Office</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Property Size</label>
                    <select
                      value={propertyDetails.size}
                      onChange={(e) => setPropertyDetails({...propertyDetails, size: e.target.value as any})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Size</option>
                      {propertySize.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Special Notes</label>
                  <textarea
                    value={propertyDetails.notes}
                    onChange={(e) => setPropertyDetails({...propertyDetails, notes: e.target.value})}
                    rows={2}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Any special instructions or notes"
                  />
                </div>
                
                {addressForm.address && addressForm.city && addressForm.state && (
                  <button
                    onClick={handleSaveToAddressBook}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    💾 Save to Address Book
                  </button>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Services List */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Your Services</h2>
              
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-gray-600">Loading services...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(categoryId ? filteredServices : services).map((service) => {
                    const serviceName = getServiceName(service);
                    const serviceDescription = service.details.find(d => d.lang === 'en')?.description || '';
                    
                    return (
                      <div key={service.id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all duration-300">
                        {/* Service Image */}
                        <div className="relative h-48 overflow-hidden">
                          {service.imageUrl ? (
                            <img 
                              src={service.imageUrl} 
                              alt={serviceName}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                              <div className="text-blue-400 text-4xl">🛠️</div>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        
                        {/* Service Content */}
                        <div className="p-6">
                          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                            {serviceName}
                          </h3>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {serviceDescription}
                          </p>
                          
                          {/* Base Price */}
                          <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
                            <div>
                              <span className="text-xs text-gray-500 uppercase tracking-wide">Starting from</span>
                              <div className="text-xl font-bold text-gray-900">₹{service.price}</div>
                              <span className="text-xs text-gray-500">{service.term} {service.termUnit}</span>
                            </div>
                          </div>
                          
                          {/* Pricing Options */}
                          <div className="space-y-2">
                            <div className="text-sm font-medium text-gray-700 mb-3">Available Packages:</div>
                            {service.pricing.map((pricing) => {
                              const isInCart = cart.some(item => 
                                item.service.id === service.id && item.selectedPricing.id === pricing.id
                              );
                              
                              return (
                                <div key={pricing.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors">
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                      <span className="font-semibold text-blue-900">₹{pricing.price}</span>
                                      <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full">
                                        {pricing.lang.toUpperCase()}
                                      </span>
                                    </div>
                                    <div className="text-sm text-blue-700">
                                      {pricing.term} {pricing.termUnit}
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => addToCart(service, pricing)}
                                    disabled={isInCart}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                      isInCart
                                        ? 'bg-green-100 text-green-700 cursor-not-allowed'
                                        : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md active:scale-95'
                                    }`}
                                  >
                                    {isInCart ? '✓ Added' : '+ Add'}
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            {/* Cart Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                  {/* Cart Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold">Your Cart</h3>
                      <div className="bg-white/20 rounded-full px-3 py-1 text-sm font-medium">
                        {cart.length} {cart.length === 1 ? 'item' : 'items'}
                      </div>
                    </div>
                  </div>
                  
                  {/* Cart Content */}
                  <div className="p-6">
                    {cart.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="text-gray-400 text-4xl mb-3">🛒</div>
                        <p className="text-gray-500 text-sm">Your cart is empty</p>
                        <p className="text-gray-400 text-xs mt-1">Add services to get started</p>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-4 mb-6">
                          {cart.map((item) => (
                            <div key={`${item.service.id}-${item.selectedPricing.id}`} className="group bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium text-gray-900 text-sm truncate">
                                    {getServiceName(item.service)}
                                  </h4>
                                  <div className="flex items-center space-x-2 mt-1">
                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                      {item.selectedPricing.lang.toUpperCase()}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      ₹{item.selectedPricing.price} / {item.selectedPricing.term} {item.selectedPricing.termUnit}
                                    </span>
                                  </div>
                                </div>
                                <button
                                  onClick={() => removeFromCart(item.service.id, item.selectedPricing.id)}
                                  className="text-gray-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </button>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <button
                                    onClick={() => {
                                      const newQuantity = item.quantity - 1;
                                      if (newQuantity <= 0) {
                                        removeFromCart(item.service.id, item.selectedPricing.id);
                                      } else {
                                        setCart(cart.map(cartItem =>
                                          cartItem.service.id === item.service.id && cartItem.selectedPricing.id === item.selectedPricing.id
                                            ? { ...cartItem, quantity: newQuantity }
                                            : cartItem
                                        ));
                                      }
                                    }}
                                    className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-blue-300 hover:bg-blue-50 transition-colors"
                                  >
                                    <span className="text-gray-600 text-sm">−</span>
                                  </button>
                                  <span className="font-medium text-gray-900 min-w-[20px] text-center">{item.quantity}</span>
                                  <button
                                    onClick={() => {
                                      setCart(cart.map(cartItem =>
                                        cartItem.service.id === item.service.id && cartItem.selectedPricing.id === item.selectedPricing.id
                                          ? { ...cartItem, quantity: item.quantity + 1 }
                                          : cartItem
                                      ));
                                    }}
                                    className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors"
                                  >
                                    <span className="text-sm">+</span>
                                  </button>
                                </div>
                                <div className="font-bold text-gray-900">
                                  ₹{item.selectedPricing.price * item.quantity}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Cart Summary */}
                        <div className="border-t border-gray-200 pt-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-600">Subtotal:</span>
                            <span className="font-semibold text-gray-900">₹{getSubtotal()}</span>
                          </div>
                          {getDiscount() > 0 && (
                            <div className="flex justify-between items-center mb-2 text-green-600">
                              <span>Discount:</span>
                              <span className="font-semibold">-₹{getDiscount()}</span>
                            </div>
                          )}
                          <div className="flex justify-between items-center text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
                            <span>Total:</span>
                            <span>₹{getSubtotal() - getDiscount()}</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );



      case 3:
        const timeSlots = [
          { value: '09:00', label: '9:00 AM', period: 'Morning' },
          { value: '10:00', label: '10:00 AM', period: 'Morning' },
          { value: '11:00', label: '11:00 AM', period: 'Morning' },
          { value: '12:00', label: '12:00 PM', period: 'Afternoon' },
          { value: '13:00', label: '1:00 PM', period: 'Afternoon' },
          { value: '14:00', label: '2:00 PM', period: 'Afternoon' },
          { value: '15:00', label: '3:00 PM', period: 'Afternoon' },
          { value: '16:00', label: '4:00 PM', period: 'Evening' },
          { value: '17:00', label: '5:00 PM', period: 'Evening' },
          { value: '18:00', label: '6:00 PM', period: 'Evening' }
        ];

        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-4">
              <CalendarIcon className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Schedule Your Service</h2>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Select Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full max-w-xs border border-gray-200 rounded-lg px-4 py-3 focus:border-gray-400 focus:shadow-md focus:outline-none"
                  />
                </div>
                
                {selectedDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Select Time Slot</label>
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot.value}
                          onClick={() => setSelectedTime(slot.value)}
                          className={`p-2 rounded-lg border text-center transition-all duration-200 hover:shadow-sm ${
                            selectedTime === slot.value
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                          }`}
                        >
                          <div className="font-medium text-sm">{slot.label}</div>
                          <div className="text-xs text-gray-500">{slot.period}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-4">
              <CreditCardIcon className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Payment & Promocodes</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Available Promocodes</h3>
                  <div className="space-y-3">
                    {promocodes.map((promo) => (
                      <div 
                        key={promo.id}
                        onClick={() => setSelectedPromocode(selectedPromocode === promo.code ? '' : promo.code)}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedPromocode === promo.code 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium text-gray-900">{promo.code}</div>
                            <div className="text-sm text-gray-600">
                              {promo.discountType === 'percentage' ? `${promo.discountValue}% off` : `₹${promo.discountValue} off`}
                            </div>
                            {promo.description && (
                              <div className="text-xs text-gray-500 mt-1">{promo.description}</div>
                            )}
                          </div>
                          {selectedPromocode === promo.code && (
                            <div className="text-blue-600 text-sm font-medium">Applied</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Add Tip</h3>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {tipOptions.map((tip) => (
                      <button
                        key={tip}
                        onClick={() => {setSelectedTip(tip); setCustomTip('');}}
                        className={`p-3 border rounded-lg text-center transition-colors ${
                          selectedTip === tip 
                            ? 'border-blue-500 bg-blue-50 text-blue-700' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {tip === 0 ? 'No Tip' : `₹${tip}`}
                      </button>
                    ))}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Custom Tip</label>
                    <input
                      type="number"
                      value={customTip}
                      onChange={(e) => {setCustomTip(e.target.value); setSelectedTip(-1);}}
                      placeholder="Enter custom amount"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{getSubtotal()}</span>
                  </div>
                  {getDiscount() > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount:</span>
                      <span>-₹{getDiscount()}</span>
                    </div>
                  )}
                  {getTipAmount() > 0 && (
                    <div className="flex justify-between">
                      <span>Tip:</span>
                      <span>₹{getTipAmount()}</span>
                    </div>
                  )}
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total:</span>
                      <span>₹{getTotal()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header 
        onLoginClick={() => setIsModalOpen(true)}
        userLocation={userLocation}
        onLocationChange={handleLocationSelect}
      />
      
      <div className="pt-20 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
          <p className="text-gray-600">{getPageSubtitle()}</p>
        </div>
      </div>
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {renderStep()}
        
        {/* Cancellation Policy and Terms - Only show on last step */}
        {currentStep === 4 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
            <div className="space-y-4">
              {/* Cancellation Policy Expandable */}
              <div className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => setShowCancellationPolicy(!showCancellationPolicy)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-900">Cancellation Policy</span>
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      showCancellationPolicy ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showCancellationPolicy && (
                  <div className="px-4 pb-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600 space-y-2 mt-3">
                      <p><strong>Free Cancellation:</strong> Cancel within 1 hour of booking at no cost.</p>
                      <p><strong>After 1 Hour:</strong> 10% cancellation fee applies on total service value.</p>
                      <p><strong>No Professional Assigned:</strong> No cancellation fee regardless of timing.</p>
                      <p><strong>Refund Process:</strong> Balance refunded to original payment method within 5-7 business days.</p>
                      <p className="text-blue-600">
                        <a href="/cancellation-policy" target="_blank" className="hover:underline">
                          View full cancellation policy →
                        </a>
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Terms Agreement */}
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="agreeToTerms" className="text-sm text-gray-600">
                  I agree to the{' '}
                  <a href="/terms" target="_blank" className="text-blue-600 hover:underline">
                    Terms & Conditions
                  </a>
                  {' '}and{' '}
                  <a href="/privacy-policy" target="_blank" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </a>
                </label>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          
          <div className="text-sm text-gray-500">
            Step {currentStep} of 4
          </div>
          
          <button
            onClick={handleNext}
            disabled={!isStepValid() || isSubmitting || (currentStep === 4 && !agreeToTerms)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Processing...' : currentStep === 4 ? 'Complete Booking' : 'Continue'}
          </button>
        </div>
      </main>
      
      <LocationModal 
        isOpen={isLocationModalOpen || showLocationModal} 
        onClose={() => {
          setIsLocationModalOpen(false);
          setShowLocationModal(false);
        }} 
        onLocationSelect={handleLocationSelect} 
      />
      
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