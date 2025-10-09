import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';




interface Service {
  id: number;
  name: string;
  categoryId: number;
  subCategoryId: number;
  imageUrl: string;
  details: Array<{
    lang: string;
    name: string;
    description: string;
  }>;
}

interface ServicesState {
  services: Service[];
  loading: boolean;
  error: string | null;
}

const initialState: ServicesState = {
  services: [],
  loading: false,
  error: null,
};


const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const fetchServices = createAsyncThunk(
  'services/fetchServices',
  async () => {
    const response = await axios.get(`${API_URL}/api/services`);
    return response.data;
  }
);

export const createService = createAsyncThunk(
  'services/createService',
  async (serviceData: Omit<Service, 'id'>) => {
    const response = await axios.post(`${API_URL}/api/services`, serviceData);
    return response.data;
  }
);

export const updateService = createAsyncThunk(
  'services/updateService',
  async ({ id, ...serviceData }: Service) => {
    const response = await axios.put(`${API_URL}/api/services/${id}`, serviceData);
    return response.data;
  }
);

export const deleteService = createAsyncThunk(
  'services/deleteService',
  async (id: number) => {
    await axios.delete(`${API_URL
      
    }/api/services/${id}`);
    return id;
  }
);

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false;
        state.services = action.payload;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch services';
      })
      .addCase(createService.fulfilled, (state, action) => {
        state.services.push(action.payload);
      })
      .addCase(updateService.fulfilled, (state, action) => {
        const index = state.services.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.services[index] = action.payload;
        }
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.services = state.services.filter(s => s.id !== action.payload);
      });
  },
});

export const { clearError } = servicesSlice.actions;
export default servicesSlice.reducer;