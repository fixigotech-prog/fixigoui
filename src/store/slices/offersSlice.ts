import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Offer {
  id: number;
  imageUrl: string;
  link: string;
  isActive: boolean;
  startDate: string;
  endDate: string;
}

interface OffersState {
  offers: Offer[];
  loading: boolean;
  error: string | null;
}

const initialState: OffersState = {
  offers: [],
  loading: false,
  error: null,
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const fetchOffers = createAsyncThunk(
  'offers/fetchOffers',
  async () => {
    const response = await axios.get(`${API_URL}/api/offers/all`);
    return response.data;
  }
);

export const createOffer = createAsyncThunk(
  'offers/createOffer',
  async (offerData: Omit<Offer, 'id'>) => {
    const response = await axios.post(`${API_URL}/api/offers`, offerData);
    return response.data;
  }
);

export const updateOffer = createAsyncThunk(
  'offers/updateOffer',
  async ({ id, ...offerData }: Offer) => {
    const response = await axios.put(`${API_URL}/api/offers/${id}`, offerData);
    return response.data;
  }
);

export const deleteOffer = createAsyncThunk(
  'offers/deleteOffer',
  async (id: number) => {
    await axios.delete(`${API_URL}/api/offers/${id}`);
    return id;
  }
);

const offersSlice = createSlice({
  name: 'offers',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOffers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOffers.fulfilled, (state, action) => {
        state.loading = false;
        state.offers = action.payload || [];
      })
      .addCase(fetchOffers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch offers';
      })
      .addCase(createOffer.fulfilled, (state, action) => {
        state.offers.push(action.payload);
      })
      .addCase(updateOffer.fulfilled, (state, action) => {
        const index = state.offers.findIndex(o => o.id === action.payload.id);
        if (index !== -1) {
          state.offers[index] = action.payload;
        }
      })
      .addCase(deleteOffer.fulfilled, (state, action) => {
        state.offers = state.offers.filter(o => o.id !== action.payload);
      });
  },
});

export const { clearError } = offersSlice.actions;
export default offersSlice.reducer;