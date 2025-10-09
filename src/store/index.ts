import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import servicesSlice from './slices/servicesSlice';
import categoriesSlice from './slices/categoriesSlice';
import bookingSlice from './slices/bookingSlice';
import locationSlice from './slices/locationSlice';
import offersSlice from './slices/offersSlice';
import frequentServicesSlice from './slices/frequentServicesSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    services: servicesSlice,
    categories: categoriesSlice,
    booking: bookingSlice,
    location: locationSlice,
    offers: offersSlice,
    frequentServices: frequentServicesSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;