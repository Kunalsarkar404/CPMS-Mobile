import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Transient — alive only between a performance manager's own login and
// picking which staff member to act as. Cleared once a StaffSession is set.
export interface PmAuth {
  userId: string;
  orgId: string;
  email: string;
  accessToken: string;
  refreshToken: string;
}

// What the app actually operates as once inside /(tabs) — the same shape
// whether it came from a direct crew login or a PM logging in on behalf of staff.
export interface StaffSession {
  staffId: string;
  orgId: string;
  fullName: string;
  accessToken: string;
  refreshToken: string;
  actingAsStaff: boolean;
  managerContext: { userId: string; email: string } | null;
}

interface AuthState {
  pmAuth: PmAuth | null;
  staffSession: StaffSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  pmAuth: null,
  staffSession: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setPmAuth: (state, action: PayloadAction<PmAuth>) => {
      state.pmAuth = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setStaffSession: (state, action: PayloadAction<StaffSession>) => {
      state.staffSession = action.payload;
      state.pmAuth = null;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },
    restoreSession: (state, action: PayloadAction<StaffSession>) => {
      state.staffSession = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    logout: (state) => {
      state.pmAuth = null;
      state.staffSession = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setPmAuth,
  setStaffSession,
  restoreSession,
  setError,
  logout,
  clearError,
} = authSlice.actions;
export default authSlice.reducer;
