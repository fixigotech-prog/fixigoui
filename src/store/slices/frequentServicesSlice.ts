import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface FrequentService {
  id: number;
  serviceId: number;
  serviceName: string;
  usageCount: number;
  imageUrl: string;
  displayOrder: number;
  isActive: boolean;
}

interface FrequentServicesState {
  services: FrequentService[];
  loading: boolean;
  error: string | null;
}

const initialState: FrequentServicesState = {
  services: [],
  loading: false,
  error: null,
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const fetchFrequentServices = createAsyncThunk(
  'frequentServices/fetchFrequentServices',
  async () => {
    const response = await axios.get(`${API_URL}/api/frequent-services`);
    return response.data;
  }
);

export const createFrequentService = createAsyncThunk(
  'frequentServices/createFrequentService',
  async (serviceData: Omit<FrequentService, 'id'>) => {
    const response = await axios.post(`${API_URL}/api/frequent-services`, serviceData);
    return response.data;
  }
);

export const updateFrequentService = createAsyncThunk(
  'frequentServices/updateFrequentService',
  async ({ id, ...serviceData }: FrequentService) => {
    const response = await axios.put(`${API_URL}/api/frequent-services/${id}`, serviceData);
    return response.data;
  }
);

export const deleteFrequentService = createAsyncThunk(
  'frequentServices/deleteFrequentService',
  async (id: number) => {
    await axios.delete(`${API_URL}/api/frequent-services/${id}`);
    return id;
  }
);

const frequentServicesSlice = createSlice({
  name: 'frequentServices',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFrequentServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFrequentServices.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload || [];
      })
      .addCase(fetchFrequentServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch frequent services';
      })
      .addCase(createFrequentService.fulfilled, (state, action) => {
        state.services.push(action.payload);
      })
      .addCase(updateFrequentService.fulfilled, (state, action) => {
        const index = state.services.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.services[index] = action.payload;
        }
      })
      .addCase(deleteFrequentService.fulfilled, (state, action) => {
        state.services = state.services.filter(s => s.id !== action.payload);
      });
  },
});

export const { clearError } = frequentServicesSlice.actions;
export default frequentServicesSlice.reducer;