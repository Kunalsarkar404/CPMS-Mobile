import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { StaffMember } from '@/constants/staff';

export type UserRole =
  | 'cabin_crew'
  | 'system_admin'
  | 'performance_manager'
  | 'super_user';

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthSession {
  user: User;
  token: string;
  selectedRole: UserRole;
  selectedStaff: StaffMember;
}

interface AuthState {
  user: User | null;
  token: string | null;
  selectedRole: UserRole | null;
  selectedStaff: StaffMember | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  selectedRole: null,
  selectedStaff: null,
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
    setUser: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.selectedRole = null;
      state.selectedStaff = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },
    setSelectedRole: (state, action: PayloadAction<UserRole>) => {
      state.selectedRole = action.payload;
    },
    setSelectedStaff: (state, action: PayloadAction<StaffMember>) => {
      state.selectedStaff = action.payload;
    },
    completeSignIn: (state) => {
      if (
        state.user &&
        state.token &&
        state.selectedRole &&
        state.selectedStaff
      ) {
        state.isAuthenticated = true;
      }
    },
    restoreSession: (state, action: PayloadAction<AuthSession>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.selectedRole = action.payload.selectedRole;
      state.selectedStaff = action.payload.selectedStaff;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.selectedRole = null;
      state.selectedStaff = null;
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
  setUser,
  setSelectedRole,
  setSelectedStaff,
  completeSignIn,
  restoreSession,
  setError,
  logout,
  clearError,
} = authSlice.actions;
export default authSlice.reducer;
