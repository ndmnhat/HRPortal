import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProfileResponseDto } from '@/api/generated/models';

interface UserState {
  profile: ProfileResponseDto | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserProfile: (state, action: PayloadAction<ProfileResponseDto>) => {
      state.profile = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearUserProfile: (state) => {
      state.profile = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { setUserProfile, setLoading, setError, clearUserProfile } = userSlice.actions;
export default userSlice.reducer;