'use client';

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Interfaces from booking/page.tsx
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

export interface Service {
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

export interface CartItem {
  service: Service;
  quantity: number;
  selectedPricing: ServicePricing;
}

export interface Promocode {
  id: number;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  expiryDate?: string;
  description?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Async thunks for fetching data
export const fetchServices = createAsyncThunk<Service[]>('booking/fetchServices', async () => {
  const response = await axios.get<Service[]>(`${API_URL}/api/services`);
  return response.data.filter(service => service.isActive);
});

export const fetchPromocodes = createAsyncThunk<Promocode[]>('booking/fetchPromocodes', async () => {
  const response = await axios.get<Promocode[]>(`${API_URL}/api/promocodes`);
  return response.data;
});

// State shape
interface BookingState {
  currentStep: number;
  services: Service[];
  cart: CartItem[];
  promocodes: Promocode[];
  selectedPromocode: string;
  selectedTip: number;
  customTip: string;
  location: { lat: number; lng: number; address: string };
  selectedDate: string;
  selectedTime: string;
  propertyDetails: {
    type: 'apartment' | 'villa' | 'bungalow' | 'house' | 'office' | '';
    size: 'Studio' | '1 BHK' | '2 BHK' | '3 BHK' | '4 BHK' | '5 BHK' | 'large' | 'extra_large' | 'Small Office' | 'Medium Office' | 'Large Office' | '';
    notes: string;
  };
  loading: boolean;
  isSubmitting: boolean;
  agreeToTerms: boolean;
}

const initialState: BookingState = {
  currentStep: 1,
  services: [],
  cart: [],
  promocodes: [],
  selectedPromocode: '',
  selectedTip: 0,
  customTip: '',
  location: { lat: 0, lng: 0, address: '' },
  selectedDate: '',
  selectedTime: '',
  propertyDetails: { type: '', size: '', notes: '' },
  loading: true,
  isSubmitting: false,
  agreeToTerms: false,
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.cart = action.payload;
    },
    addToCart: (state, action: PayloadAction<{ service: Service; pricing: ServicePricing }>) => {
      const { service, pricing } = action.payload;
      const existingItem = state.cart.find(item => 
        item.service.id === service.id && item.selectedPricing.id === pricing.id
      );
      if (existingItem) {
        existingItem.quantity++;
      } else {
        state.cart.push({ service, quantity: 1, selectedPricing: pricing });
      }
    },
    removeFromCart: (state, action: PayloadAction<{ serviceId: number; pricingId: number }>) => {
      const { serviceId, pricingId } = action.payload;
      state.cart = state.cart.filter(item => 
        !(item.service.id === serviceId && item.selectedPricing.id === pricingId)
      );
    },
    updateCartItemQuantity: (state, action: PayloadAction<{ serviceId: number; pricingId: number; quantity: number }>) => {
        const { serviceId, pricingId, quantity } = action.payload;
        const item = state.cart.find(item => item.service.id === serviceId && item.selectedPricing.id === pricingId);
        if (item) {
            if (quantity <= 0) {
                state.cart = state.cart.filter(i => !(i.service.id === serviceId && i.selectedPricing.id === pricingId));
            } else {
                item.quantity = quantity;
            }
        }
    },
    setSelectedPromocode: (state, action: PayloadAction<string>) => {
      state.selectedPromocode = action.payload;
    },
    setSelectedTip: (state, action: PayloadAction<number>) => {
      state.selectedTip = action.payload;
      state.customTip = '';
    },
    setCustomTip: (state, action: PayloadAction<string>) => {
      state.customTip = action.payload;
      state.selectedTip = -1;
    },
    setLocation: (state, action: PayloadAction<{ lat: number; lng: number; address: string }>) => {
      state.location = action.payload;
    },
    setSelectedDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload;
    },
    setSelectedTime: (state, action: PayloadAction<string>) => {
      state.selectedTime = action.payload;
    },
    setPropertyDetails: (state, action: PayloadAction<Partial<BookingState['propertyDetails']>>) => {
      state.propertyDetails = { ...state.propertyDetails, ...action.payload };
    },
    setAgreeToTerms: (state, action: PayloadAction<boolean>) => {
      state.agreeToTerms = action.payload;
    },
    setIsSubmitting: (state, action: PayloadAction<boolean>) => {
      state.isSubmitting = action.payload;
    },
    resetBooking: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.services = action.payload;
        state.loading = false;
      })
      .addCase(fetchServices.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchPromocodes.fulfilled, (state, action) => {
        state.promocodes = action.payload;
      });
  },
});

export const {
  setCurrentStep, setCart, addToCart, removeFromCart, updateCartItemQuantity,
  setSelectedPromocode, setSelectedTip, setCustomTip, setLocation,
  setSelectedDate, setSelectedTime, setPropertyDetails, setAgreeToTerms,
  setIsSubmitting, resetBooking
} = bookingSlice.actions;

export default bookingSlice.reducer;