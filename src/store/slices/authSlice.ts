import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface User {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  role: string;
  isVip: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const sendOTP = createAsyncThunk(
  'auth/sendOTP',
  async ({ phone }: { phone: string }) => {
    const response = await axios.post(`${API_URL}/api/auth/login`, { phone });
    return response.data;
  }
);

export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async ({ phone, otp }: { phone: string; otp: string }) => {
    const response = await axios.post(`${API_URL}/api/auth/verify-otp`, { phone, otp });
    return response.data;
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: { fullName: string; phone: string; email: string; password: string }) => {
    const response = await axios.post(`${API_URL}/api/auth/register`, userData);
    return response.data;
  }
);

export const verifyRegistrationOTP = createAsyncThunk(
  'auth/verifyRegistrationOTP',
  async ({ phone, otp }: { phone: string; otp: string }) => {
    const response = await axios.post(`${API_URL}/api/auth/verify-registration-otp`, { phone, otp });
    return response.data;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    },
    clearError: (state) => {
      state.error = null;
    },
    loadAuthFromStorage: (state) => {
      const token = localStorage.getItem('authToken');
      const user = localStorage.getItem('user');
      if (token && user) {
        state.token = token;
        state.user = JSON.parse(user);
        state.isAuthenticated = true;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOTP.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to send OTP';
      })
      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem('authToken', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'OTP verification failed';
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Registration failed';
      })
      .addCase(verifyRegistrationOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyRegistrationOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem('authToken', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(verifyRegistrationOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Registration OTP verification failed';
      });
  },
});

export const { logout, clearError, loadAuthFromStorage } = authSlice.actions;
export default authSlice.reducer;