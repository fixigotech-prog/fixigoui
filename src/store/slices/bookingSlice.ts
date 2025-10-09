import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Booking {
  id: number;
  serviceId: number;
  customerId: number;
  providerId?: number;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  scheduledDate: string;
  address: string;
  totalAmount: number;
}

interface AddressBookEntry {
  id: number;
  address: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  isDefault?: boolean;
}

interface BookingState {
  bookings: Booking[];
  currentBooking: Booking | null;
  addressBook: AddressBookEntry[];
  cities: string[];
  states: string[];
  selectedAddress: AddressBookEntry | null;
  loading: boolean;
  error: string | null;
}

const initialState: BookingState = {
  bookings: [],
  currentBooking: null,
  addressBook: [],
  cities: [],
  states: [],
  selectedAddress: null,
  loading: false,
  error: null,
};

export const fetchBookings = createAsyncThunk(
  'booking/fetchBookings',
  async () => {
    const response = await axios.get(`${API_URL}/api/bookings`);
    return response.data;
  }
);

export const createBooking = createAsyncThunk(
  'booking/createBooking',
  async (bookingData: Omit<Booking, 'id'>) => {
    const response = await axios.post(`${API_URL}/api/bookings`, bookingData);
    return response.data;
  }
);

export const updateBookingStatus = createAsyncThunk(
  'booking/updateStatus',
  async ({ id, status }: { id: number; status: Booking['status'] }) => {
    const response = await axios.patch(`${API_URL}/api/bookings/${id}`, { status });
    return response.data;
  }
);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const fetchAddressBook = createAsyncThunk(
  'booking/fetchAddressBook',
  async () => {
    const response = await axios.get(`${API_URL}/api/address-book`);
    return response.data;
  }
);

export const addToAddressBook = createAsyncThunk(
  'booking/addToAddressBook',
  async (address: Omit<AddressBookEntry, 'id'>) => {
    const response = await axios.post(`${API_URL}/api/address-book`, address);
    return response.data;
  }
);

export const fetchCitiesStates = createAsyncThunk(
  'booking/fetchCitiesStates',
  async () => {
    try {
      const response = await axios.get(`${API_URL}/api/cities`);
      const cities = Array.isArray(response.data) ? response.data : [];
      return { cities, states: [] };
    } catch (error) {
      return { cities: [], states: [] };
    }
  }
);

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setCurrentBooking: (state, action) => {
      state.currentBooking = action.payload;
    },
    clearCurrentBooking: (state) => {
      state.currentBooking = null;
    },
    setSelectedAddress: (state, action) => {
      state.selectedAddress = action.payload;
    },
    clearSelectedAddress: (state) => {
      state.selectedAddress = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch bookings';
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.bookings.push(action.payload);
        state.currentBooking = action.payload;
      })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        const index = state.bookings.findIndex(b => b.id === action.payload.id);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
        if (state.currentBooking?.id === action.payload.id) {
          state.currentBooking = action.payload;
        }
      })
      .addCase(fetchAddressBook.fulfilled, (state, action) => {
        state.addressBook = action.payload;
      })
      .addCase(addToAddressBook.fulfilled, (state, action) => {
        state.addressBook.push(action.payload);
      })
      .addCase(fetchCitiesStates.fulfilled, (state, action) => {
        state.cities = action.payload.cities;
        state.states = action.payload.states;
      });
  },
});

export const { setCurrentBooking, clearCurrentBooking, setSelectedAddress, clearSelectedAddress, clearError } = bookingSlice.actions;
export default bookingSlice.reducer;