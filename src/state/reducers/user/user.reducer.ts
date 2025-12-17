import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Profile } from '@/types';

interface UserState {
  token?: string;
  profile?: Profile;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Partial<UserState>>) => {
      state.token = action.payload.token;
      state.profile = action.payload.profile;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.token = undefined;
      state.profile = undefined;
      state.isAuthenticated = false;
    },
    updateUserProfile: (state, action: PayloadAction<Profile | undefined>) => {
      state.profile = action.payload;
    },
  },
});

export const { setUser, clearUser, updateUserProfile } = userSlice.actions;

export default userSlice.reducer;
