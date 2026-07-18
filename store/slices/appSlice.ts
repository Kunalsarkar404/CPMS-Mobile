import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ThemeMode = 'light' | 'dark' | 'system';

interface AppState {
  themeMode: ThemeMode;
  isOnboarded: boolean;
  isLoading: boolean;
}

const initialState: AppState = {
  themeMode: 'system',
  isOnboarded: false,
  isLoading: true,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.themeMode = action.payload;
    },
    setOnboarded: (state, action: PayloadAction<boolean>) => {
      state.isOnboarded = action.payload;
    },
    setAppLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setThemeMode, setOnboarded, setAppLoading } = appSlice.actions;
export default appSlice.reducer;
