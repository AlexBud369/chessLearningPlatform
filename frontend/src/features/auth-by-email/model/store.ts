import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthByEmailState {
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthByEmailState = {
  isLoading: false,
  error: null,
};

const authByEmailSlice = createSlice({
  name: 'authByEmail',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setLoading, setError } = authByEmailSlice.actions;
export const authByEmailReducer = authByEmailSlice.reducer;