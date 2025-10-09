import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface City {
  id: number;
  city: string;
  state: string;
  lat: number;
  lng: number;
}

interface LocationState {
  cities: City[];
  selectedLocation: { lat: number; lng: number; address: string } | null;
  loading: boolean;
  error: string | null;
}

const initialState: LocationState = {
  cities: [],
  selectedLocation: null,
  loading: false,
  error: null,
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const fetchCities = createAsyncThunk(
  'location/fetchCities',
  async () => {
    const response = await axios.get(`${API_URL}/api/cities`);
    return response.data;
  }
);

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setSelectedLocation: (state, action) => {
      state.selectedLocation = action.payload;
      localStorage.setItem('userLocation', JSON.stringify(action.payload));
    },
    loadLocationFromStorage: (state) => {
      const saved = localStorage.getItem('userLocation');
      if (saved) {
        state.selectedLocation = JSON.parse(saved);
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.loading = false;
        state.cities = action.payload;
      })
      .addCase(fetchCities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch cities';
      });
  },
});

export const { setSelectedLocation, loadLocationFromStorage, clearError } = locationSlice.actions;
export default locationSlice.reducer;